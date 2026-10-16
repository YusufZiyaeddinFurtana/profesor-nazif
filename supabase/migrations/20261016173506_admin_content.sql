-- Roles are assigned only by a project owner / trusted server, never user metadata.
create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role = 'admin'),
  created_at timestamptz not null default now()
);
alter table public.user_roles enable row level security;
revoke all on public.user_roles from public, anon, authenticated;
grant all on public.user_roles to service_role;
grant select(user_id,role) on public.user_roles to authenticated;
create policy "own role read" on public.user_roles for select to authenticated using(user_id=(select auth.uid()));
create function private.is_admin() returns boolean
language sql stable security definer set search_path='' as $$
  select auth.uid() is not null and exists(select 1 from public.user_roles where user_id=auth.uid() and role='admin');
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;
create function public.is_admin() returns boolean
language sql stable security invoker set search_path='' as $$select private.is_admin()$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Public descriptions are deliberately separate from private video IDs / PDF paths.
create table public.lesson_catalog (
  id text primary key references public.lesson_materials(lesson_id) on delete cascade,
  course_id text not null references public.learning_courses(id),
  program text not null check(program in ('FRC','FTC','FLL')),
  lesson_group text not null,
  topic text not null,
  title text not null check(length(btrim(title)) between 1 and 240),
  summary text not null check(length(btrim(summary)) between 1 and 600),
  long_description text not null check(length(btrim(long_description)) between 1 and 12000),
  translations jsonb not null default '{}',
  cover_label text,
  image text,
  sort_order integer not null check(sort_order between 0 and 10000),
  is_listed boolean not null default false,
  video_available boolean not null default false,
  ever_published boolean not null default false,
  updated_at timestamptz not null default now()
);
create index lesson_catalog_course_idx on public.lesson_catalog(course_id);
alter table public.lesson_catalog enable row level security;
revoke all on public.lesson_catalog from public,anon,authenticated;
grant select(id,course_id,program,lesson_group,topic,title,summary,long_description,translations,cover_label,image,sort_order,is_listed,video_available) on public.lesson_catalog to anon,authenticated;
grant all on public.lesson_catalog to service_role;
create policy "listed lesson descriptions" on public.lesson_catalog for select to anon,authenticated using(is_listed);

-- Canonical routing map. Clients choose one course; the server derives group/topic.
create table private.admin_categories (
  course_id text primary key references public.learning_courses(id),
  lesson_group text not null,
  topic text not null
);
revoke all on private.admin_categories from public,anon,authenticated;
insert into private.admin_categories(course_id,lesson_group,topic) values
('frc/scouting','Business Management','Scouting'),
('frc/mechanics','Mekanik','Mechanics'),
('frc/programming','Yazılım','Programming'),
('frc/electronics','Elektronik','Electronics'),
('frc/fundraising','Business Management','Fundraising'),
('frc/sustainability','Business Management','Sustainability'),
('frc/leadership','Business Management','Leadership'),
('frc/first','Business Management','FIRST'),
('frc/media','Business Management','Media'),
('frc/business-management','Business Management','Business Management'),
('fll/robot-yapimi','Robot Yapımı','Robot Yapımı'),
('fll/programlama','Programlama','Programlama'),
('fll/ozdegerler','Özdeğerler','Özdeğerler'),
('fll/proje','Proje','Proje'),
('ftc/mechanics','Mekanik','Mekanik'),
('ftc/electronics','Elektronik','Elektronik'),
('ftc/programming','Yazılım','Yazılım'),
('ftc/business-management','Business Management','Business Management');
insert into public.lesson_catalog(id,course_id,program,lesson_group,topic,title,summary,long_description,translations,cover_label,image,sort_order,is_listed,video_available,ever_published) values
('wpilib-java','frc/programming','FRC','Yazılım','Programming','WPILib Java ile ilk robot kodu','Bir FRC projesinin yapısını ve ilk komutların robota nasıl ulaştığını keşfet.','Bu taslak derste WPILib projesindeki temel dosyaları, robot kodunun çalışma akışını ve bir komutun donanımla ilişkisini adım adım ele alıyoruz. Gerçek video ve uygulama dosyaları eklendiğinde bu alan ders materyalleriyle genişletilecek.','{"en": {"title": "Your first robot code with WPILib Java", "summary": "Discover the structure of an FRC project and how its first commands reach the robot.", "longDescription": "This draft lesson walks through the key files in a WPILib project, the robot code’s execution flow and how a command relates to hardware. Lesson materials will be added here when the video and practice files are ready."}, "zh-Hans": {"title": "用 WPILib Java 编写第一段机器人代码", "summary": "了解 FRC 项目的结构，以及最初的指令如何传递到机器人。", "longDescription": "本课草稿逐步介绍 WPILib 项目的关键文件、机器人代码的运行流程，以及指令与硬件之间的关系。视频和练习文件准备好后，这里将补充课程材料。"}, "hil": {"title": "Ang imo una nga robot code gamit ang WPILib Java", "summary": "Usisaa ang porma sang proyekto sa FRC kag kon paano makaabot sa robot ang una nga mga mando.", "longDescription": "Sa sini nga burador nga leksyon, tun-an naton sing amat-amat ang mga panguna nga file sang WPILib, ang dalagan sang robot code kag ang relasyon sang mando sa hardware. Idugang diri ang mga materyales kon handa na ang bidyo kag mga file para sa pagpraktis."}}','WPILib Java',null,0,true,false,false),
('frc-mechanics','frc/mechanics','FRC','Mekanik','Mechanics','FRC mekanik: hareket sistemi','Şasi, motor ve aktarma parçalarının robot hareketini nasıl oluşturduğunu öğren.','Robotun hareket edebilmesi için mekanik parçaların birlikte nasıl çalışması gerektiğini inceliyoruz. Şasi düzeni, motor seçimi ve hareketin tekerleklere aktarılması gibi başlıklar, ileride eklenecek uygulama videosunun omurgasını oluşturuyor.','{"en": {"title": "FRC mechanics: the drivetrain", "summary": "Learn how the chassis, motors and transmission make a robot move.", "longDescription": "Explore how mechanical parts work together to move a robot. Chassis layout, motor selection and power transmission to the wheels form the outline for the practical video to be added later."}, "zh-Hans": {"title": "FRC 机械：传动系统", "summary": "学习底盘、电机与传动部件如何让机器人运动。", "longDescription": "探索机械部件如何协同工作，让机器人动起来。底盘布局、电机选择及动力向车轮的传递，构成后续实践视频的课程框架。"}, "hil": {"title": "Mekanika sa FRC: sistema sang paghulag", "summary": "Tun-i kon paano ginapahulag ang robot sang chassis, motor kag mga piyesa sang transmission.", "longDescription": "Usisaon naton kon paano nagabinuligay ang mekanikal nga mga piyesa agod makahulag ang robot. Ang paghan-ay sang chassis, pagpili sang motor kag pagdala sang gahum sa mga rueda amo ang balayan sang praktikal nga bidyo nga idugang sa ulihi."}}','FRC Mechanics',null,1,true,false,false),
('gyro-sensor','frc/electronics','FRC','Elektronik','Electronics','Gyro ve sensörlerle yön takibi','Sensör verisinin robotun yönünü anlamasına nasıl yardımcı olduğunu gör.','Gyro sensörünün ürettiği açı bilgisini ve bu bilginin robot kontrolünde nerede kullanıldığını açıklıyoruz. Bağlantı, veri okuma ve doğrulama adımları gerçek ders içeriği hazır olduğunda burada gösterilecek.','{"en": {"title": "Track direction with a gyro and sensors", "summary": "See how sensor data helps a robot understand its direction.", "longDescription": "Learn about the angle data produced by a gyro and where it is used in robot control. Wiring, reading data and validation steps will be shown here when the lesson content is ready."}, "zh-Hans": {"title": "用陀螺仪和传感器追踪方向", "summary": "看看传感器数据如何帮助机器人判断方向。", "longDescription": "了解陀螺仪产生的角度数据及其在机器人控制中的用途。课程内容准备好后，这里将展示接线、读取数据和验证结果的步骤。"}, "hil": {"title": "Pagsubay sang direksyon gamit ang gyro kag mga sensor", "summary": "Tan-awa kon paano nagabulig ang datos sang sensor sa robot nga mahibaluan ang direksyon sini.", "longDescription": "Tun-an naton ang datos sang anggulo halin sa gyro kag kon diin ini ginagamit sa pagkontrol sang robot. Ipakita diri ang pagkonekta, pagbasa sang datos kag pag-usisa kon handa na ang sulod sang leksyon."}}','Gyro + Sensors',null,2,true,false,false),
('pid-otonom','frc/programming','FRC','Yazılım','Programming','Otonom sürüş ve PID mantığı','Hedefe yaklaşırken ölçüm ve düzeltme döngüsünü sade bir örnekle tanı.','Bu ders taslağı, otonom hareket için bir hedef belirlemeyi ve robotun ölçtüğü değere göre hareketini düzeltmesini anlatır. PID kavramını formülden önce sezgisel bir döngü olarak ele alıp gerçek robot örneğine bağlamayı amaçlar.','{"en": {"title": "Autonomous driving and the idea behind PID", "summary": "Meet the measurement and correction loop through a simple example.", "longDescription": "This draft explains setting a target for autonomous movement and correcting the robot’s motion using measured values. It introduces PID as an intuitive loop before the formula and connects it to a real robot example."}, "zh-Hans": {"title": "自主行驶与 PID 原理", "summary": "通过简单示例认识接近目标时的测量与修正循环。", "longDescription": "本课草稿介绍如何为自主运动设定目标，并根据测量值修正机器人的运动。我们先将 PID 作为直观的循环来理解，再接触公式，并联系真实机器人示例。"}, "hil": {"title": "Awtonomo nga pagpadalagan kag ang ideya sang PID", "summary": "Kilalaha ang siklo sang pagsukod kag pagtadlong paagi sa simple nga halimbawa.", "longDescription": "Ini nga burador nagapaathag sang pagtakda sang target para sa awtonomo nga paghulag kag pagtadlong sang lihok sang robot base sa nasukod sini. Ipakilala ang PID bilang siklo anay antes sang pormula, kag iangot sa halimbawa sang aktuwal nga robot."}}','Otonom + PID',null,3,true,false,false),
('takim-surekliligi','frc/sustainability','FRC','Business Management','Sustainability','Takımın bilgisini geleceğe taşı','Dokümantasyon ve görev paylaşımıyla birikimin sonraki sezona kalmasını sağla.','Bir FRC takımının yalnızca robot üretmediğini; bilgi, deneyim ve çalışma alışkanlıkları da geliştirdiğini konuşuyoruz. Bu taslak içerik, yeni üyelerin katılımı ve devir süreçleri için kullanılabilecek temel fikirleri toplar.','{"en": {"title": "Carry the team’s knowledge forward", "summary": "Use documentation and shared responsibilities to preserve experience for the next season.", "longDescription": "An FRC team builds more than robots: it develops knowledge, experience and working habits. This draft brings together basic ideas for welcoming new members and handing over responsibilities."}, "zh-Hans": {"title": "传承团队知识", "summary": "通过文档和任务分工，将积累的经验留给下一赛季。", "longDescription": "FRC 团队不仅制造机器人，也积累知识、经验和工作习惯。本课草稿汇集了帮助新成员融入及交接职责的基本思路。"}, "hil": {"title": "Ipadayon ang ihibalo sang grupo", "summary": "Gamita ang dokumentasyon kag pagbahin sang buluhaton agod mapreserbar ang eksperyensya para sa masunod nga season.", "longDescription": "Ang grupo sa FRC nagahimo indi lang sang robot, kundi sang ihibalo, eksperyensya kag mga batasan sa pagtrabaho. Ini nga burador nagatipon sang mga ideya para sa pagbaton sang bag-o nga mga miyembro kag pagpasahay sang mga responsibilidad."}}','Business Management',null,4,true,false,false),
('fll-mindstorms','fll/programlama','FLL','Programlama','Programlama','Mindstorms: kırmızı bloklar','Bluetooth bağlantısını ve robotu uyanık tutma mantığını birlikte keşfet.','Paylaşılan eski kapaktaki Mindstorms dersi, FLL programlama örneği olarak burada yer alıyor. Kırmızı bloklar, Bluetooth bağlantısı ve robotun hazır durumda tutulması başlıkları gerçek video yüklendiğinde ayrıntılı ders akışına dönüşecek.','{"en": {"title": "Mindstorms: red blocks", "summary": "Explore Bluetooth connections and how to keep the robot awake.", "longDescription": "The Mindstorms lesson from the shared original cover appears here as an FLL programming example. Red blocks, Bluetooth and keeping the robot ready will become a detailed lesson sequence when the actual video is uploaded."}, "zh-Hans": {"title": "Mindstorms：红色积木", "summary": "一起探索蓝牙连接与让机器人保持唤醒的原理。", "longDescription": "来自所分享旧封面的 Mindstorms 课程，在这里作为 FLL 编程示例。实际视频上传后，红色积木、蓝牙连接与保持机器人就绪等主题将组成详细的课程流程。"}, "hil": {"title": "Mindstorms: pula nga mga block", "summary": "Usisaa ang koneksyon sa Bluetooth kag kon paano magpabilin nga aktibo ang robot.", "longDescription": "Ang leksyon sa Mindstorms halin sa ginpaambit nga daan nga cover ara diri bilang halimbawa sang FLL programming. Ang pula nga mga block, Bluetooth kag pagpabilin nga handa sang robot mangin detalyado nga leksyon kon ma-upload na ang aktuwal nga bidyo."}}','FLL Yazılım','/fll-cover.png',5,true,false,false),
('fll-robot-yapimi','fll/robot-yapimi','FLL','Robot Yapımı','Robot Yapımı','FLL robotunu göreve hazırla','Bir görevin ihtiyacından başlayarak basit ve geliştirilebilir robot kur.','FLL robotu tasarlarken görev koşullarını okuma, parçaları yerleştirme ve deneme sonucuna göre düzenleme adımlarını ele alıyoruz. Bu açıklama ders planı taslağıdır; gerçek yapım görüntüleri daha sonra eklenecek.','{"en": {"title": "Get your FLL robot ready for its mission", "summary": "Start with the mission’s needs and build a simple robot you can improve.", "longDescription": "Read mission requirements, position components and revise the robot based on test results. This description is a draft lesson plan; actual build footage will be added later."}, "zh-Hans": {"title": "让 FLL 机器人做好任务准备", "summary": "从任务需求出发，搭建简单且可改进的机器人。", "longDescription": "学习解读任务条件、放置部件，并根据测试结果调整机器人。这是一份课程计划草稿，实际搭建影像将在之后补充。"}, "hil": {"title": "Ihanda ang imo FLL robot para sa buluhaton", "summary": "Magsugod sa kinahanglanon sang buluhaton kag maghimo sang simple nga robot nga mapauswag mo.", "longDescription": "Tun-an naton ang pagbasa sang mga kinahanglanon sang buluhaton, pagbutang sang mga piyesa kag pagbag-o sang robot base sa resulta sang pagtilaw. Ini nga pagpaathag burador sang plano sang leksyon; idugang sa ulihi ang aktuwal nga bidyo sang paghimo."}}','FLL Donanım',null,6,true,false,false),
('fll-ozdegerler','fll/ozdegerler','FLL','Özdeğerler','Özdeğerler','Özdeğerlerle takım olmak','Birlikte öğrenme, paylaşma ve birbirini destekleme üzerine düşün.','FLL deneyiminin önemli bir parçası olan takım kültürünü günlük çalışma örnekleriyle açmayı planlıyoruz. Bu taslak bölüm, ortak karar alma ve herkesin katkısını görünür kılma üzerine kuruludur.','{"en": {"title": "Becoming a team through core values", "summary": "Think about learning together, sharing and supporting each other.", "longDescription": "We plan to explore team culture, an important part of FLL, through everyday working examples. This draft focuses on shared decisions and recognizing everyone’s contribution."}, "zh-Hans": {"title": "用核心价值凝聚团队", "summary": "思考如何一起学习、分享并相互支持。", "longDescription": "团队文化是 FLL 体验的重要部分，我们计划用日常合作中的例子来讲解。本课草稿围绕共同决策和让每个人的贡献被看见展开。"}, "hil": {"title": "Mangin grupo paagi sa mga prinsipyo", "summary": "Pamalandungi ang pagtuon sing tingob, pagpaambit kag pagsuporta sa isa kag isa.", "longDescription": "Plano naton nga usisaon ang kultura sang grupo, isa ka importante nga bahin sang FLL, paagi sa adlaw-adlaw nga mga halimbawa. Ini nga burador nagatutok sa tingob nga pagdesisyon kag pagkilala sa kontribusyon sang tanan."}}','FLL Özdeğerler',null,7,true,false,false),
('fll-proje','fll/proje','FLL','Proje','Proje','Bir fikirden proje sunumuna','Problemi araştır, çözümünü geliştir ve hikâyeni anlaşılır biçimde anlat.','Proje sürecinin başlangıcında doğru soruyu sormak, farklı çözüm fikirlerini karşılaştırmak ve ekip olarak bir sunum oluşturmak gerekir. Gerçek proje örnekleri geldiğinde bu alanda adım adım içerik yer alacak.','{"en": {"title": "From an idea to a project presentation", "summary": "Research the problem, develop a solution and tell your story clearly.", "longDescription": "A project starts with asking the right question, comparing possible solutions and preparing a presentation as a team. Step-by-step content will be added here when real project examples are available."}, "zh-Hans": {"title": "从创意到项目展示", "summary": "研究问题、完善解决方案，并清晰地讲述你的故事。", "longDescription": "项目从提出合适的问题、比较不同方案，以及团队共同准备展示开始。真实项目示例准备好后，这里将补充逐步讲解的内容。"}, "hil": {"title": "Halin sa ideya pakadto sa presentasyon sang proyekto", "summary": "Usisaa ang problema, pauswaga ang solusyon kag isugid sing maathag ang imo istorya.", "longDescription": "Ang proyekto nagasugod sa husto nga pamangkot, pagkomparar sang mga solusyon kag pagpreparar sang presentasyon bilang grupo. Idugang diri ang amat-amat nga mga leksyon kon may aktuwal na nga mga halimbawa sang proyekto."}}','FLL Proje',null,8,true,false,false);
update public.lesson_catalog c set video_available=m.is_published,ever_published=m.is_published from public.lesson_materials m where m.lesson_id=c.id;

-- Upload immutable unique PDF objects. Students never receive upload permission.
create policy "admins upload exercise PDFs" on storage.objects for insert to authenticated with check(
  bucket_id='lesson-exercises' and (select private.is_admin())
  and name ~ ('^admin/' || (select auth.uid())::text || '/[A-Za-z0-9_-]+\.pdf$')
);
create policy "admins read exercise PDFs" on storage.objects for select to authenticated using(
  bucket_id='lesson-exercises' and (select private.is_admin())
);
-- Only unattached uploads may be cleaned up; no deletion of a lesson's PDF.
create policy "admins clean unattached PDFs" on storage.objects for delete to authenticated using(
  bucket_id='lesson-exercises' and (select private.is_admin())
  and name ~ ('^admin/' || (select auth.uid())::text || '/[A-Za-z0-9_-]+\.pdf$')
  and not exists(select 1 from public.lesson_materials m where m.exercise_path=name)
);
-- Policy needs the reference check to see drafts too, without exposing draft materials.
create function private.exercise_attached(p_path text) returns boolean
language sql stable security definer set search_path='' as $$
  select auth.uid() is not null and exists(select 1 from public.lesson_materials where exercise_path=p_path);
$$;
revoke all on function private.exercise_attached(text) from public,anon;
grant execute on function private.exercise_attached(text) to authenticated;
alter policy "admins clean unattached PDFs" on storage.objects using(
  bucket_id='lesson-exercises' and (select private.is_admin())
  and name ~ ('^admin/' || (select auth.uid())::text || '/[A-Za-z0-9_-]+\.pdf$')
  and not private.exercise_attached(name)
);

create function private.admin_lessons() returns jsonb
language plpgsql security definer set search_path='' as $$
begin
  if not private.is_admin() then raise exception 'Admin required' using errcode='42501'; end if;
  return coalesce((select jsonb_agg(to_jsonb(c)||jsonb_build_object(
    'youtube_video_id',m.youtube_video_id,'video_duration_seconds',m.video_duration_seconds,
    'exercise_path',m.exercise_path,'is_published',m.is_published) order by c.program,c.course_id,c.sort_order,c.id)
    from public.lesson_catalog c join public.lesson_materials m on m.lesson_id=c.id),'[]'::jsonb);
end $$;
revoke all on function private.admin_lessons() from public,anon;
grant execute on function private.admin_lessons() to authenticated;
create function public.admin_lessons() returns jsonb
language sql security invoker set search_path='' as $$select private.admin_lessons()$$;
revoke all on function public.admin_lessons() from public,anon;
grant execute on function public.admin_lessons() to authenticated;

create function private.admin_save_lesson(p_input jsonb) returns text
language plpgsql security definer set search_path='' as $$
declare
  v_id text := p_input->>'id'; v_course text := p_input->>'courseId';
  v_title text := btrim(p_input->>'title'); v_summary text := btrim(p_input->>'summary');
  v_description text := btrim(p_input->>'longDescription');
  v_video text := nullif(p_input->>'videoId',''); v_pdf text := nullif(p_input->>'exercisePath','');
  v_duration integer;
  v_order integer;
  v_publish boolean;
  v_category private.admin_categories%rowtype; v_old public.lesson_catalog%rowtype;
  v_material public.lesson_materials%rowtype; v_program text;
begin
  if not private.is_admin() then raise exception 'Admin required' using errcode='42501'; end if;
  v_duration := (p_input->>'duration')::integer; v_order := (p_input->>'sortOrder')::integer; v_publish := (p_input->>'publish')::boolean;
  if v_id is null or v_id !~ '^[a-z0-9][a-z0-9-]{2,99}$'
    or v_title is null or length(v_title) not between 1 and 240
    or v_summary is null or length(v_summary) not between 1 and 600
    or v_description is null or length(v_description) not between 1 and 12000
    or v_order is null or v_order not between 0 and 10000 or v_publish is null
    then raise exception 'Invalid lesson fields' using errcode='22023'; end if;
  select * into v_category from private.admin_categories where course_id=v_course;
  if not found then raise exception 'Invalid category' using errcode='22023'; end if;
  select program into v_program from public.learning_courses where id=v_course;
  -- Serialize course membership changes and concurrent saves for the same identity.
  perform pg_advisory_xact_lock(hashtextextended('admin-lesson/'||v_id,0));
  perform pg_advisory_xact_lock(hashtextextended('admin-course/'||v_course,0));
  select * into v_old from public.lesson_catalog where id=v_id for update;
  if found then
    if p_input->>'expectedUpdatedAt' is null or (p_input->>'expectedUpdatedAt')::timestamptz <> v_old.updated_at
      then raise exception 'Lesson changed; reload before saving' using errcode='40001'; end if;
    if v_course<>v_old.course_id then raise exception 'Category cannot change after creation' using errcode='22023'; end if;
    select * into v_material from public.lesson_materials where lesson_id=v_id for update;
    if v_old.ever_published and (v_video is distinct from v_material.youtube_video_id or v_duration is distinct from v_material.video_duration_seconds)
      then raise exception 'Published video is immutable; create a new lesson' using errcode='22023'; end if;
  elsif p_input->>'expectedUpdatedAt' is not null then
    raise exception 'Lesson missing; reload' using errcode='40001';
  end if;
  if v_video is not null and v_video !~ '^[A-Za-z0-9_-]{11}$' then raise exception 'Invalid YouTube ID' using errcode='22023'; end if;
  if v_duration is not null and v_duration not between 1 and 86400 then raise exception 'Invalid duration' using errcode='22023'; end if;
  if v_pdf is not null then
    if v_pdf !~ '^[A-Za-z0-9/_-]+\.pdf$' or not exists(select 1 from storage.objects where bucket_id='lesson-exercises' and name=v_pdf)
      then raise exception 'Upload a PDF first' using errcode='22023'; end if;
  end if;
  if v_publish and (v_video is null or v_duration is null or v_pdf is null)
    then raise exception 'Video, duration and PDF required to publish' using errcode='22023'; end if;
  insert into public.lesson_materials(lesson_id,title,youtube_video_id,video_duration_seconds,exercise_path,is_published)
    values(v_id,v_title,v_video,v_duration,v_pdf,v_publish)
    on conflict(lesson_id) do update set title=excluded.title,youtube_video_id=excluded.youtube_video_id,
      video_duration_seconds=excluded.video_duration_seconds,exercise_path=excluded.exercise_path,is_published=excluded.is_published;
  insert into public.lesson_catalog(id,course_id,program,lesson_group,topic,title,summary,long_description,sort_order,is_listed,video_available,ever_published)
    values(v_id,v_course,v_program,v_category.lesson_group,v_category.topic,v_title,v_summary,v_description,v_order,v_publish,v_publish,v_publish)
    on conflict(id) do update set title=excluded.title,summary=excluded.summary,long_description=excluded.long_description,
      translations=case when lesson_catalog.title=excluded.title and lesson_catalog.summary=excluded.summary and lesson_catalog.long_description=excluded.long_description then lesson_catalog.translations else '{}'::jsonb end,
      sort_order=excluded.sort_order,is_listed=excluded.is_listed,video_available=excluded.video_available,
      ever_published=lesson_catalog.ever_published or excluded.ever_published,updated_at=clock_timestamp();
  insert into public.course_lessons(course_id,lesson_id,sort_order) values(v_course,v_id,v_order)
    on conflict(course_id,lesson_id) do update set sort_order=excluded.sort_order;
  if v_program='FRC' and v_category.lesson_group='Business Management' and v_course<>'frc/business-management' then
    insert into public.course_lessons(course_id,lesson_id,sort_order) values('frc/business-management',v_id,v_order)
      on conflict(course_id,lesson_id) do update set sort_order=excluded.sort_order;
  end if;
  update public.learning_courses c set is_published=exists(
    select 1 from public.course_lessons cl join public.lesson_materials m on m.lesson_id=cl.lesson_id
      where cl.course_id=c.id and m.is_published
  ) where c.id in (v_course,case when v_program='FRC' and v_category.lesson_group='Business Management' then 'frc/business-management' else v_course end);
  return v_id;
end $$;
revoke all on function private.admin_save_lesson(jsonb) from public,anon;
grant execute on function private.admin_save_lesson(jsonb) to authenticated;
create function public.admin_save_lesson(p_input jsonb) returns text
language sql security invoker set search_path='' as $$select private.admin_save_lesson(p_input)$$;
revoke all on function public.admin_save_lesson(jsonb) from public,anon;
grant execute on function public.admin_save_lesson(jsonb) to authenticated;

-- Draft lessons must not prevent completion of a published curriculum.
alter policy "published course membership" on public.course_lessons using(
  exists(select 1 from public.learning_courses c where c.id=course_id)
  and exists(select 1 from public.lesson_materials m where m.lesson_id=course_lessons.lesson_id and m.is_published)
);
create or replace function private.check_course_completions(p_lesson_id text) returns void
language plpgsql security definer set search_path='' as $$
declare v_user uuid := auth.uid(); v_course text;
begin
  if v_user is null then raise exception 'Sign in required' using errcode='42501'; end if;
  for v_course in select cl.course_id from public.course_lessons cl join public.learning_courses c on c.id=cl.course_id where cl.lesson_id=p_lesson_id and c.is_published loop
    perform pg_advisory_xact_lock(hashtextextended(v_user::text || '/' || v_course,0));
    if not exists (
      select 1 from public.course_lessons cl join public.lesson_materials m on m.lesson_id=cl.lesson_id
      left join public.lesson_progress p on p.lesson_id=m.lesson_id and p.user_id=v_user
      where cl.course_id=v_course and m.is_published and (p.video_completed_at is null or p.exercise_completed_at is null)
    ) then
      insert into public.course_completions(user_id,course_id) values(v_user,v_course) on conflict do nothing;
    end if;
  end loop;
end $$;
