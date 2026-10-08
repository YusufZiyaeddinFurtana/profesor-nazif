import type { Locale, LessonTranslation } from "../types";
/** Example content only. API lessons supply their own optional translations. */
export const mockLessonTranslations: Record<
  string,
  Partial<Record<Locale, LessonTranslation>>
> = {
  "wpilib-java": {
    en: {
      title: "Your first robot code with WPILib Java",
      summary:
        "Discover the structure of an FRC project and how its first commands reach the robot.",
      longDescription:
        "This draft lesson walks through the key files in a WPILib project, the robot code’s execution flow and how a command relates to hardware. Lesson materials will be added here when the video and practice files are ready.",
    },
    "zh-Hans": {
      title: "用 WPILib Java 编写第一段机器人代码",
      summary: "了解 FRC 项目的结构，以及最初的指令如何传递到机器人。",
      longDescription:
        "本课草稿逐步介绍 WPILib 项目的关键文件、机器人代码的运行流程，以及指令与硬件之间的关系。视频和练习文件准备好后，这里将补充课程材料。",
    },
    hil: {
      title: "Ang imo una nga robot code gamit ang WPILib Java",
      summary:
        "Usisaa ang porma sang proyekto sa FRC kag kon paano makaabot sa robot ang una nga mga mando.",
      longDescription:
        "Sa sini nga burador nga leksyon, tun-an naton sing amat-amat ang mga panguna nga file sang WPILib, ang dalagan sang robot code kag ang relasyon sang mando sa hardware. Idugang diri ang mga materyales kon handa na ang bidyo kag mga file para sa pagpraktis.",
    },
  },
  "frc-mechanics": {
    en: {
      title: "FRC mechanics: the drivetrain",
      summary:
        "Learn how the chassis, motors and transmission make a robot move.",
      longDescription:
        "Explore how mechanical parts work together to move a robot. Chassis layout, motor selection and power transmission to the wheels form the outline for the practical video to be added later.",
    },
    "zh-Hans": {
      title: "FRC 机械：传动系统",
      summary: "学习底盘、电机与传动部件如何让机器人运动。",
      longDescription:
        "探索机械部件如何协同工作，让机器人动起来。底盘布局、电机选择及动力向车轮的传递，构成后续实践视频的课程框架。",
    },
    hil: {
      title: "Mekanika sa FRC: sistema sang paghulag",
      summary:
        "Tun-i kon paano ginapahulag ang robot sang chassis, motor kag mga piyesa sang transmission.",
      longDescription:
        "Usisaon naton kon paano nagabinuligay ang mekanikal nga mga piyesa agod makahulag ang robot. Ang paghan-ay sang chassis, pagpili sang motor kag pagdala sang gahum sa mga rueda amo ang balayan sang praktikal nga bidyo nga idugang sa ulihi.",
    },
  },
  "gyro-sensor": {
    en: {
      title: "Track direction with a gyro and sensors",
      summary: "See how sensor data helps a robot understand its direction.",
      longDescription:
        "Learn about the angle data produced by a gyro and where it is used in robot control. Wiring, reading data and validation steps will be shown here when the lesson content is ready.",
    },
    "zh-Hans": {
      title: "用陀螺仪和传感器追踪方向",
      summary: "看看传感器数据如何帮助机器人判断方向。",
      longDescription:
        "了解陀螺仪产生的角度数据及其在机器人控制中的用途。课程内容准备好后，这里将展示接线、读取数据和验证结果的步骤。",
    },
    hil: {
      title: "Pagsubay sang direksyon gamit ang gyro kag mga sensor",
      summary:
        "Tan-awa kon paano nagabulig ang datos sang sensor sa robot nga mahibaluan ang direksyon sini.",
      longDescription:
        "Tun-an naton ang datos sang anggulo halin sa gyro kag kon diin ini ginagamit sa pagkontrol sang robot. Ipakita diri ang pagkonekta, pagbasa sang datos kag pag-usisa kon handa na ang sulod sang leksyon.",
    },
  },
  "pid-otonom": {
    en: {
      title: "Autonomous driving and the idea behind PID",
      summary:
        "Meet the measurement and correction loop through a simple example.",
      longDescription:
        "This draft explains setting a target for autonomous movement and correcting the robot’s motion using measured values. It introduces PID as an intuitive loop before the formula and connects it to a real robot example.",
    },
    "zh-Hans": {
      title: "自主行驶与 PID 原理",
      summary: "通过简单示例认识接近目标时的测量与修正循环。",
      longDescription:
        "本课草稿介绍如何为自主运动设定目标，并根据测量值修正机器人的运动。我们先将 PID 作为直观的循环来理解，再接触公式，并联系真实机器人示例。",
    },
    hil: {
      title: "Awtonomo nga pagpadalagan kag ang ideya sang PID",
      summary:
        "Kilalaha ang siklo sang pagsukod kag pagtadlong paagi sa simple nga halimbawa.",
      longDescription:
        "Ini nga burador nagapaathag sang pagtakda sang target para sa awtonomo nga paghulag kag pagtadlong sang lihok sang robot base sa nasukod sini. Ipakilala ang PID bilang siklo anay antes sang pormula, kag iangot sa halimbawa sang aktuwal nga robot.",
    },
  },
  "takim-surekliligi": {
    en: {
      title: "Carry the team’s knowledge forward",
      summary:
        "Use documentation and shared responsibilities to preserve experience for the next season.",
      longDescription:
        "An FRC team builds more than robots: it develops knowledge, experience and working habits. This draft brings together basic ideas for welcoming new members and handing over responsibilities.",
    },
    "zh-Hans": {
      title: "传承团队知识",
      summary: "通过文档和任务分工，将积累的经验留给下一赛季。",
      longDescription:
        "FRC 团队不仅制造机器人，也积累知识、经验和工作习惯。本课草稿汇集了帮助新成员融入及交接职责的基本思路。",
    },
    hil: {
      title: "Ipadayon ang ihibalo sang grupo",
      summary:
        "Gamita ang dokumentasyon kag pagbahin sang buluhaton agod mapreserbar ang eksperyensya para sa masunod nga season.",
      longDescription:
        "Ang grupo sa FRC nagahimo indi lang sang robot, kundi sang ihibalo, eksperyensya kag mga batasan sa pagtrabaho. Ini nga burador nagatipon sang mga ideya para sa pagbaton sang bag-o nga mga miyembro kag pagpasahay sang mga responsibilidad.",
    },
  },
  "fll-mindstorms": {
    en: {
      title: "Mindstorms: red blocks",
      summary: "Explore Bluetooth connections and how to keep the robot awake.",
      longDescription:
        "The Mindstorms lesson from the shared original cover appears here as an FLL programming example. Red blocks, Bluetooth and keeping the robot ready will become a detailed lesson sequence when the actual video is uploaded.",
    },
    "zh-Hans": {
      title: "Mindstorms：红色积木",
      summary: "一起探索蓝牙连接与让机器人保持唤醒的原理。",
      longDescription:
        "来自所分享旧封面的 Mindstorms 课程，在这里作为 FLL 编程示例。实际视频上传后，红色积木、蓝牙连接与保持机器人就绪等主题将组成详细的课程流程。",
    },
    hil: {
      title: "Mindstorms: pula nga mga block",
      summary:
        "Usisaa ang koneksyon sa Bluetooth kag kon paano magpabilin nga aktibo ang robot.",
      longDescription:
        "Ang leksyon sa Mindstorms halin sa ginpaambit nga daan nga cover ara diri bilang halimbawa sang FLL programming. Ang pula nga mga block, Bluetooth kag pagpabilin nga handa sang robot mangin detalyado nga leksyon kon ma-upload na ang aktuwal nga bidyo.",
    },
  },
  "fll-robot-yapimi": {
    en: {
      title: "Get your FLL robot ready for its mission",
      summary:
        "Start with the mission’s needs and build a simple robot you can improve.",
      longDescription:
        "Read mission requirements, position components and revise the robot based on test results. This description is a draft lesson plan; actual build footage will be added later.",
    },
    "zh-Hans": {
      title: "让 FLL 机器人做好任务准备",
      summary: "从任务需求出发，搭建简单且可改进的机器人。",
      longDescription:
        "学习解读任务条件、放置部件，并根据测试结果调整机器人。这是一份课程计划草稿，实际搭建影像将在之后补充。",
    },
    hil: {
      title: "Ihanda ang imo FLL robot para sa buluhaton",
      summary:
        "Magsugod sa kinahanglanon sang buluhaton kag maghimo sang simple nga robot nga mapauswag mo.",
      longDescription:
        "Tun-an naton ang pagbasa sang mga kinahanglanon sang buluhaton, pagbutang sang mga piyesa kag pagbag-o sang robot base sa resulta sang pagtilaw. Ini nga pagpaathag burador sang plano sang leksyon; idugang sa ulihi ang aktuwal nga bidyo sang paghimo.",
    },
  },
  "fll-ozdegerler": {
    en: {
      title: "Becoming a team through core values",
      summary:
        "Think about learning together, sharing and supporting each other.",
      longDescription:
        "We plan to explore team culture, an important part of FLL, through everyday working examples. This draft focuses on shared decisions and recognizing everyone’s contribution.",
    },
    "zh-Hans": {
      title: "用核心价值凝聚团队",
      summary: "思考如何一起学习、分享并相互支持。",
      longDescription:
        "团队文化是 FLL 体验的重要部分，我们计划用日常合作中的例子来讲解。本课草稿围绕共同决策和让每个人的贡献被看见展开。",
    },
    hil: {
      title: "Mangin grupo paagi sa mga prinsipyo",
      summary:
        "Pamalandungi ang pagtuon sing tingob, pagpaambit kag pagsuporta sa isa kag isa.",
      longDescription:
        "Plano naton nga usisaon ang kultura sang grupo, isa ka importante nga bahin sang FLL, paagi sa adlaw-adlaw nga mga halimbawa. Ini nga burador nagatutok sa tingob nga pagdesisyon kag pagkilala sa kontribusyon sang tanan.",
    },
  },
  "fll-proje": {
    en: {
      title: "From an idea to a project presentation",
      summary:
        "Research the problem, develop a solution and tell your story clearly.",
      longDescription:
        "A project starts with asking the right question, comparing possible solutions and preparing a presentation as a team. Step-by-step content will be added here when real project examples are available.",
    },
    "zh-Hans": {
      title: "从创意到项目展示",
      summary: "研究问题、完善解决方案，并清晰地讲述你的故事。",
      longDescription:
        "项目从提出合适的问题、比较不同方案，以及团队共同准备展示开始。真实项目示例准备好后，这里将补充逐步讲解的内容。",
    },
    hil: {
      title: "Halin sa ideya pakadto sa presentasyon sang proyekto",
      summary:
        "Usisaa ang problema, pauswaga ang solusyon kag isugid sing maathag ang imo istorya.",
      longDescription:
        "Ang proyekto nagasugod sa husto nga pamangkot, pagkomparar sang mga solusyon kag pagpreparar sang presentasyon bilang grupo. Idugang diri ang amat-amat nga mga leksyon kon may aktuwal na nga mga halimbawa sang proyekto.",
    },
  },
};
