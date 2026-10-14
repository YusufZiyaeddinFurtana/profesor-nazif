import type { Locale } from "../types";
import type {
  CourseGroup,
  EducationCategory,
} from "../../features/education/types";
type Text = { title: string; description: string };
const categories: Record<Exclude<Locale, "tr">, Record<string, Text>> = {
  en: {
    "FRC/scouting": {
      title: "Scouting",
      description: "Observe matches and turn data into team decisions.",
    },
    "FRC/mechanics": {
      title: "Mechanics",
      description:
        "The foundations of chassis, drivetrain and mechanism design.",
    },
    "FRC/programming": {
      title: "Programming",
      description: "Robot code, control flow and autonomous behavior.",
    },
    "FRC/electronics": {
      title: "Electronics",
      description: "Wiring, power distribution and sensor connections.",
    },
    "FRC/fundraising": {
      title: "Fundraising",
      description: "Plan funding sources and relationships with supporters.",
    },
    "FRC/sustainability": {
      title: "Sustainability",
      description:
        "Carry the team’s knowledge and practices into the next season.",
    },
    "FRC/leadership": {
      title: "Leadership",
      description:
        "Sharing tasks, communicating and making decisions as a team.",
    },
    "FRC/first": {
      title: "FIRST",
      description:
        "Get to know FIRST culture and the program’s guiding approach.",
    },
    "FRC/media": {
      title: "Media",
      description: "Share the team’s work clearly and effectively.",
    },
    "FRC/business-management": {
      title: "Business Management",
      description:
        "Explore team management through fundraising, leadership, communication and sustainability.",
    },
    "FLL/robot-yapimi": {
      title: "Robot Building",
      description: "Design, build and improve a robot for its mission.",
    },
    "FLL/programlama": {
      title: "Programming",
      description:
        "Give commands with blocks, use sensors and build mission sequences.",
    },
    "FLL/ozdegerler": {
      title: "Core Values",
      description:
        "A culture of creating together, showing respect and sharing what you learn.",
    },
    "FLL/proje": {
      title: "Project",
      description:
        "Explore a problem, develop an idea and present your solution.",
    },
  },
  "zh-Hans": {
    "FRC/scouting": {
      title: "赛事侦察",
      description: "观察比赛，将数据转化为团队决策。",
    },
    "FRC/mechanics": {
      title: "机械",
      description: "学习底盘、传动系统和机构设计的基础。",
    },
    "FRC/programming": {
      title: "编程",
      description: "机器人代码、控制流程与自主行为。",
    },
    "FRC/electronics": {
      title: "电子",
      description: "布线、电力分配与传感器连接。",
    },
    "FRC/fundraising": {
      title: "筹款",
      description: "规划资金来源与支持者关系。",
    },
    "FRC/sustainability": {
      title: "持续发展",
      description: "将团队的知识和工作方法传承到下一赛季。",
    },
    "FRC/leadership": {
      title: "领导力",
      description: "任务分工、沟通与团队决策。",
    },
    "FRC/first": {
      title: "FIRST",
      description: "了解 FIRST 文化与项目的基本理念。",
    },
    "FRC/media": {
      title: "媒体",
      description: "清晰、有效地分享团队成果。",
    },
    "FRC/business-management": {
      title: "团队运营",
      description: "通过筹款、领导力、沟通与持续发展，探索团队运营。",
    },
    "FLL/robot-yapimi": {
      title: "机器人搭建",
      description: "根据任务设计、搭建并改进机器人。",
    },
    "FLL/programlama": {
      title: "编程",
      description: "使用积木编程下达指令、读取传感器并构建任务流程。",
    },
    "FLL/ozdegerler": {
      title: "核心价值",
      description: "共同创造、相互尊重并分享所学的文化。",
    },
    "FLL/proje": {
      title: "项目",
      description: "探索问题、发展创意并展示解决方案。",
    },
  },
  hil: {
    "FRC/scouting": {
      title: "Pag-usisa sang mga hampang",
      description:
        "Obserbahi ang mga hampang kag gamita ang datos sa mga desisyon sang grupo.",
    },
    "FRC/mechanics": {
      title: "Mekanika",
      description:
        "Mga basehan sang pagdisenyo sang chassis, sistema sang paghulag kag mga mekanismo.",
    },
    "FRC/programming": {
      title: "Programming",
      description:
        "Code sang robot, dalagan sang mga mando kag awtonomo nga paghulag.",
    },
    "FRC/electronics": {
      title: "Elektronika",
      description:
        "Mga kable, pagpanagtag sang kuryente kag koneksyon sang mga sensor.",
    },
    "FRC/fundraising": {
      title: "Pagpangita sang pondo",
      description:
        "Planuhon ang mga ginahalinan sang pondo kag relasyon sa mga nagasuporta.",
    },
    "FRC/sustainability": {
      title: "Pagpadayon sang grupo",
      description:
        "Ipadayon ang ihibalo kag mga pamaagi sang grupo sa masunod nga season.",
    },
    "FRC/leadership": {
      title: "Pagpanguna",
      description:
        "Pagbahin sang mga buluhaton, pag-istoryahanay kag pagdesisyon bilang grupo.",
    },
    "FRC/first": {
      title: "FIRST",
      description:
        "Kilalaha ang kultura sang FIRST kag ang panguna nga pamaagi sang programa.",
    },
    "FRC/media": {
      title: "Media",
      description:
        "Ipaambit sing maathag kag epektibo ang mga ginahimo sang grupo.",
    },
    "FRC/business-management": {
      title: "Pagdumala sang grupo",
      description:
        "Usisaa ang pagdumala sang grupo paagi sa pagpangita sang pondo, pagpanguna, komunikasyon kag pagpadayon.",
    },
    "FLL/robot-yapimi": {
      title: "Paghimo sang robot",
      description:
        "Disenyohi, himua kag pauswaga ang robot para sa buluhaton sini.",
    },
    "FLL/programlama": {
      title: "Programming",
      description:
        "Maghatag sang mga mando paagi sa blocks, gamita ang mga sensor kag himua ang sunod-sunod nga mga buluhaton.",
    },
    "FLL/ozdegerler": {
      title: "Mga prinsipyo",
      description:
        "Kultura sang pagbinuligay, pagtahod kag pagpaambit sang natun-an.",
    },
    "FLL/proje": {
      title: "Proyekto",
      description:
        "Usisaa ang problema, pauswaga ang ideya kag ipresentar ang imo solusyon.",
    },
  },
};
const groups: Record<Exclude<Locale, "tr">, Record<string, Text>> = {
  en: {
    "frc-mekanik": {
      title: "Mechanics",
      description:
        "The robot’s structure, drivetrain and how its parts work together.",
    },
    "frc-elektronik": {
      title: "Electronics",
      description: "Work safely with power, connections and sensor data.",
    },
    "frc-yazilim": {
      title: "Programming",
      description:
        "WPILib, Java, autonomous behavior and the basics of robot control.",
    },
    "frc-business": {
      title: "Business Management",
      description:
        "Fundraising, team continuity, leadership and telling our story.",
    },
    "fll-robot": {
      title: "Robot Building",
      description: "Design, build and improve a robot for its mission.",
    },
    "fll-programlama": {
      title: "Programming",
      description:
        "Give commands with blocks, use sensors and build mission sequences.",
    },
    "fll-ozdegerler": {
      title: "Core Values",
      description:
        "A culture of creating together, showing respect and sharing what you learn.",
    },
    "fll-proje": {
      title: "Project",
      description:
        "Explore a problem, develop an idea and present your solution.",
    },
  },
  "zh-Hans": {
    "frc-mekanik": {
      title: "机械",
      description: "了解机器人的结构、传动系统以及部件如何协同工作。",
    },
    "frc-elektronik": {
      title: "电子",
      description: "安全使用电源、连接线路与传感器数据。",
    },
    "frc-yazilim": {
      title: "编程",
      description: "WPILib、Java、自主行为与机器人控制基础。",
    },
    "frc-business": {
      title: "团队运营",
      description: "筹款、团队传承、领导力与团队故事传播。",
    },
    "fll-robot": {
      title: "机器人搭建",
      description: "根据任务设计、搭建并改进机器人。",
    },
    "fll-programlama": {
      title: "编程",
      description: "使用积木编程下达指令、读取传感器并构建任务流程。",
    },
    "fll-ozdegerler": {
      title: "核心价值",
      description: "共同创造、相互尊重并分享所学的文化。",
    },
    "fll-proje": {
      title: "项目",
      description: "探索问题、发展创意并展示解决方案。",
    },
  },
  hil: {
    "frc-mekanik": {
      title: "Mekanika",
      description:
        "Ang lawas sang robot, sistema sang paghulag kag pagbinuligay sang mga piyesa.",
    },
    "frc-elektronik": {
      title: "Elektronika",
      description:
        "Luwas nga paggamit sang kuryente, mga koneksyon kag datos halin sa mga sensor.",
    },
    "frc-yazilim": {
      title: "Programming",
      description:
        "WPILib, Java, awtonomo nga paghulag kag mga basehan sang pagkontrol sang robot.",
    },
    "frc-business": {
      title: "Pagdumala sang grupo",
      description:
        "Pagpangita sang pondo, pagpadayon sang grupo, pagpanguna kag pagsugid sang aton istorya.",
    },
    "fll-robot": {
      title: "Paghimo sang robot",
      description:
        "Disenyohi, himua kag pauswaga ang robot para sa buluhaton sini.",
    },
    "fll-programlama": {
      title: "Programming",
      description:
        "Maghatag sang mga mando paagi sa blocks, gamita ang mga sensor kag himua ang sunod-sunod nga mga buluhaton.",
    },
    "fll-ozdegerler": {
      title: "Mga prinsipyo",
      description:
        "Kultura sang pagbinuligay, pagtahod kag pagpaambit sang natun-an.",
    },
    "fll-proje": {
      title: "Proyekto",
      description:
        "Usisaa ang problema, pauswaga ang ideya kag ipresentar ang imo solusyon.",
    },
  },
};
/** Display copy only: slugs, topics and group keys never change with language. */
export function localizeCategory(
  category: EducationCategory,
  locale: Locale,
): EducationCategory {
  return locale === "tr"
    ? category
    : {
        ...category,
        ...categories[locale][
          `${category.program === "FTC" ? "FRC" : category.program}/${category.slug}`
        ],
      };
}
export function localizeGroup(group: CourseGroup, locale: Locale): CourseGroup {
  if (locale === "tr") return group;
  if (group.program === "FTC")
    return { ...group, ...categories[locale][`FRC/${group.categorySlug}`] };
  return { ...group, ...groups[locale][group.id] };
}
