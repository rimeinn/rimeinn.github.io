> La Rime 架构设计解读

# 概念解读

## 框架

输入法工作于需要输入文本的程序中，后者就叫他做输入法的「客户程序」吧。

如果输入法同时在不同的程序中工作，每个客户程序里的输入内容都是不同的。
所以需要为每个客户维护输入法状态，术语称输入法「上下文／Context」。

逻辑复杂的输入法，常常有个独立的程序来做运算，便于集中管理词库等资源。
Rime称其为「服务／Service」，形式为一个无介面表现的后台程序／Backend。

于是输入法的「前端／Frontend」，即输入法在客户程序中的那部份，可依托于后台的服务来运作，自身只需关注与操作系统交互，以及将消息向服务转发。

Rime的Frontend/Backend模型，依照ibus、IMK等输入法框架来设计：Frontend不含输入逻辑，甚至不负责绘制输入法介面。因此会比较容易适配现有的输入法框架，不需要自己写很多代码。

在服务中，会为每一个客户建立一个输入法「会话／Session」。从功能上讲，会话是将一系列按键消息变（Convert）为文字的问（Request）答（Response）过程。

技术上讲，会话会负责搞定输入法前端与服务之间的跨进程通信，同时在服务端为前端所代表的客户分配必要的资源。这资源主要是指一部有状态的、懂得所有输入转换逻辑的输入法引擎「Engine」。

现在所写的Rime库，不做那框架部份，专注于输入引擎的实现。
名字也叫「中州韵输入法引擎／RIME」嘛。

这部份定义的代码是 [rime/librime](https://github.com/rime/librime)，under C++ namespace `rime`。
抛开实际的输入法框架，俺先写个控制台程序 `RimeConsole` 来模拟输入，观察Engine的输出，以验证其功能是否符合设计。

## 引擎

输入法的转换逻辑自然是比较复杂，需要许多元件协同工作。要协同工作，比得组装到一起，外面再加个壳。通常的机器都是如此，有外壳做封装，看不到内部的元件，通过有限的几处机关来操作，用起来比较省心。

Engine 对象，便是 Session 需要直接操作的介面。
除此之外，Rime库还对外提供若干用于输入输出的数据对象。
包括他所持有的代表输入法状态的「上下文／Context」对象、
描述一份「输入方案／Schema」的配置对象、
代表输入按键的 `KeyEvent` 对象等。

开发者对 Engine 的期望，一是将来可不断通过添加内部组件的方式增益其所不能，二是有能力动态地调整组件的调度，以在会话中切换到不同的输入方式。

为了避免知道得太多，这引擎的内部构造必须精巧，他存在的意义在于接合内部的各种组件、并对外提供可靠的接口：Engine所表达的逻辑仅限于此。

标准化Engine内部的「组件／Component」，明确与关键组件之间的对接方式，就可以满足可扩展、可配置这两点期望。

# 设计与实现

## 组件

为有好的扩展能力，定义一个接口来表示具有某种能力的一类组件；
为了达到可在运行时动态配置的目的，采取抽象工厂的设计模式。

`boost::factory`要求较高版本的Boost库，所以我还是用了自家酿造的一套设施来做组件的包装。

原则是，Rime中完成特定功能的对象，若只有一种实现方法，就写个C++类／class；若有多种实现方法，就写个「Rime类」／`rime::Class`。示意：
```
class Processor : public Class<Processor, Engine*> {
 public:
  Processor(Engine *engine) : engine_(engine) {}
  virtual ~Processor() {}
  // Processor的功能是处理按键消息
  virtual bool ProcessKeyEvent(const KeyEvent &ke);
 private:
  Engine *engine_;
};
```

然后，大家就可以写各式Processor的实现啦……
当然，还要把每一种实现注册为具名的「组件」。
```
class ToUpperCase : public Processor {
 public:
  ToUpperCase(Engine *engine);
  virtual bool ProcessKeyEvent(const KeyEvent &ke) {
    char ch = ke.ToAscii();
    if (islower(ch)) {
      engine_->CommitChar(ch - 'a' + 'A');
      return true;
    }
    return false;
  }
};

void RegisterRimeComponents() {
  Registry.instance().Register("upper", new Component<ToUpperCase>);
  // 注册各种组件到Registry...
}
```

用法：
```
void UsingAProcessor() {
  // Class<>模板提供了简便的方法，按名称取得组件
  // Class<T>::Require() 从Registry中取得T::Component的指针
  // 而Component<T>继承自T::Component，并实现了其中的纯虚函数Create()
  Processor::Component* component = Processor::Require("upper");
  // 利用组件生成所需的对象
  KeyEvent key;   // 输入
  Engine engine;  // 上屏文字由此输出
  Processor* processor = component->Create(&engine);
  bool taken = processor->ProcessKeyEvent(key);
  delete processor;
}
```
实际的代码中，会将这个例子改造成Engine持有Processor对象，并转发输入按键给Processor。

## 框架级组件和基础组件

以Engine的视角，可以把各种组件分为框架级组件和基础组件。前者会由Engine创建并直接调用，故需要为每一类组件定义明确的接口。后者作为实现具体功能的积木，由框架级组件的实现类使用。

### 框架级组件

目前设计中规划了三类框架级组件：

  * Processor，处理按键，编辑输入串
  * Segmentor，解释输入串「是什么」，将输入串分段，标记输入内容的可能类型
  * Translator，翻译一段输入，给出一组备选结果

对于每一类组件，Engine将根据Schema中的配置，创建若干实例，并按一定规则调度，从而将复杂的输入法逻辑分解到组件的各种实现里，按输入方案的需求组合。

当Engine接到前端传来的按键消息，会顺次调用一组Processor的ProcessKeyEvent()方法。
在这方法里，每个Processor可决定是接受并处理该按键，放弃该按键还给系统做默认处理，还是留给其他的Processor来决定。

Processor的处理结果表现为对Context的修改。当某个Processor修改了Context的编码串时，Engine获得信号通知，开始切分和翻译的流程。

首先按次序由各Segmentor尝试对编码串分段。通过N个回合，将编码串分为N个编码段。每一回合中，各Segmentor给出从编码串指定位置开始可识别的最长编码序列，及对应的编码类型标签。回合中最长的分段将被采纳，将该编码段的始末位置及一组编码类型标签记入Context中的分段信息。优先级较高的Segmentor也可以中止当前回合从而跳过优先级较低的Segmentor。

接下来，对每一个编码段，调用各Translator做翻译。Translator可凭借编码类型标签来判断本Translator能否完成该编码段的翻译。

每个Translator针对一个编码段的翻译结果为Translation对象，是用来取得一组候选结果的迭代器。同一编码段由不同Translator给出的Translations，存入Menu对象。为了在有大量候选结果的情况下保持效率，Menu仅在需要时，譬如向后翻页时，才会从Translation中取得一定数目的候选结果。
Translation有和其他Translation比较的方法，用于根据下一个候选结果的内容、或某种预定的策略来决定候选结果的排序。

Context中的Composition，汇总了分段信息、使用者在各代码段对应的Menu中所选结果等信息。经过使用者手动确认结果、且未发生编辑动作的编码段，将不再做重新分段的处理。

### 基础组件

TODO(lotem): 补完文档

基础组件：

  * Dictionary, 词典，由编码序列检索候选结果
  * UserDictionary, 动态的用户词典
  * Prism, 音节拼写至词典编码的映射
  * Algebra, 拼写运算规则
  * Syllablifier, 音节切分算法