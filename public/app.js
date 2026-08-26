const resumeFields = [
  'name','role','phone','email','location','years','website','summary','skills',
  'company','jobTitle','jobPeriod','highlights','company2','jobTitle2','jobPeriod2','highlights2',
  'projectName','projectRole','projectPeriod','projectHighlights',
  'school','degree','eduPeriod','gpa','eduHighlights','certificates','languages'
];
const templateNames = {ats:'清晰通用',modern:'现代职场',campus:'校园新锐',minimal:'极简黑白',executive:'资深管理',tech:'科技蓝图',creative:'创意双栏',warm:'暖调人文'};
const sampleResume = {
  name:'林一然', role:'产品经理', phone:'138 0000 0000', email:'linyiran@example.com', location:'上海', years:'3 年经验',
  website:'linyiran.design',
  summary:'擅长从用户洞察中定义问题，以数据驱动产品迭代。主导过 0→1 产品建设与跨团队协作，关注业务结果，也在意体验细节。',
  skills:'用户研究, 数据分析, 项目管理, 增长策略, B端产品', company:'星河科技有限公司', jobTitle:'产品经理', jobPeriod:'2023.07 — 至今',
  highlights:'负责核心业务流程重构，推动需求分析、方案设计与上线复盘全流程。\n通过数据看板定位转化瓶颈，关键路径转化率提升 18%。\n协调设计、研发与运营团队，将重点项目交付周期缩短 25%。',
  company2:'远山互联',jobTitle2:'产品实习生',jobPeriod2:'2022.06 — 2022.12',highlights2:'参与用户反馈体系建设，整理 600+ 条反馈并推动 8 项体验优化上线。',
  projectName:'求职效率工具 0→1',projectRole:'项目负责人',projectPeriod:'2023.02 — 2023.06',projectHighlights:'完成 30 位目标用户访谈，提炼三类核心求职场景。\n设计并验证最小可行方案，四周内获得 1,200 名种子用户。',
  school:'南方科技大学', degree:'信息管理 · 本科', eduPeriod:'2019.09 — 2023.06',gpa:'GPA 3.7 / 专业前 10%',eduHighlights:'校级优秀毕业生\n学生创新项目负责人',
  certificates:'PMP 项目管理认证, 全国大学生创新创业奖',languages:'英语 CET-6, 普通话二级甲等'
};

const extraEntryConfig = {
  works:{container:'extraWorkEditors',preview:'previewExtraWorks',label:'经历',start:3,fields:[
    {key:'company',label:'公司',placeholder:'公司名称'},
    {key:'title',label:'职位',placeholder:'职位名称'},
    {key:'period',label:'任职时间',placeholder:'2021.06 — 2022.06',wide:true},
    {key:'highlights',label:'工作成果',placeholder:'每行一条工作成果',wide:true,textarea:true}
  ]},
  projects:{container:'extraProjectEditors',preview:'previewExtraProjects',label:'项目',start:2,fields:[
    {key:'name',label:'项目名称',placeholder:'项目名称'},
    {key:'role',label:'担任角色',placeholder:'项目负责人'},
    {key:'period',label:'项目时间',placeholder:'2024.03 — 2024.06',wide:true},
    {key:'highlights',label:'项目成果',placeholder:'每行一条，写清问题、行动和结果',wide:true,textarea:true}
  ]},
  educations:{container:'extraEducationEditors',preview:'previewExtraEducations',label:'教育经历',start:2,fields:[
    {key:'school',label:'学校',placeholder:'学校名称'},
    {key:'degree',label:'专业 / 学历',placeholder:'信息管理 · 本科'},
    {key:'period',label:'就读时间',placeholder:'2019.09 — 2023.06'},
    {key:'gpa',label:'成绩 / 排名',placeholder:'GPA 3.8 / 专业前 10%'},
    {key:'highlights',label:'主修课程 / 校园经历',placeholder:'选填，每行一条',wide:true,textarea:true}
  ]}
};

const fallbackJobs = [
  {id:1,title:'高级产品经理',company:'星河科技',city:'上海',experience:'3-5年',salary:'28-35K',salaryMin:28,tags:['B端产品','数据分析','项目管理'],age:1,color:'#514778',desc:'负责企业级协作产品规划，以用户研究和业务数据驱动产品迭代。',requirements:['3 年以上互联网产品经验','具备复杂业务流程设计能力','有数据分析和跨团队项目经验']},
  {id:2,title:'AI 产品经理',company:'远望智能',city:'北京',experience:'3-5年',salary:'30-45K',salaryMin:30,tags:['AI应用','用户研究','增长策略'],age:2,color:'#315f7b',desc:'探索大模型在效率工具中的落地场景，负责从需求验证到产品上线。',requirements:['了解生成式 AI 产品形态','能够独立完成用户调研','具备良好的产品设计能力']},
  {id:3,title:'SaaS 产品经理',company:'安云网络',city:'杭州',experience:'1-3年',salary:'20-28K',salaryMin:20,tags:['SaaS','B端产品','数据分析'],age:3,color:'#b77744',desc:'负责客户成功平台的需求分析、功能规划和商业化能力建设。',requirements:['1 年以上 B 端产品经验','熟悉 SaaS 业务模式','逻辑清晰，沟通能力强']},
  {id:4,title:'用户增长产品经理',company:'浮光互动',city:'深圳',experience:'3-5年',salary:'25-38K',salaryMin:25,tags:['增长策略','用户研究','A/B测试'],age:1,color:'#8a536d',desc:'围绕拉新、激活与留存搭建增长产品体系，持续优化转化效率。',requirements:['有完整增长项目经验','熟悉实验设计和数据分析','结果导向，执行力强']},
  {id:5,title:'数据产品经理',company:'数帆科技',city:'上海',experience:'3-5年',salary:'26-36K',salaryMin:26,tags:['数据分析','数据平台','项目管理'],age:4,color:'#3d6e71',desc:'建设统一数据指标平台，服务业务分析、运营决策和精细化管理。',requirements:['理解数据仓库与指标体系','能够抽象复杂业务需求','有数据平台经验优先']},
  {id:6,title:'商业化产品经理',company:'青禾传媒',city:'广州',experience:'3-5年',salary:'22-32K',salaryMin:22,tags:['商业化','增长策略','项目管理'],age:5,color:'#697a40',desc:'负责广告商业化产品策略与平台能力建设，提升客户投放效率。',requirements:['有广告或商业化经验','具备策略与平台产品能力','良好的跨部门推动力']},
  {id:7,title:'产品经理',company:'鹿鸣生活',city:'成都',experience:'1-3年',salary:'15-22K',salaryMin:15,tags:['C端产品','用户研究','数据分析'],age:2,color:'#9b6645',desc:'负责本地生活用户端体验迭代，洞察需求并跟踪核心产品指标。',requirements:['热爱 C 端产品体验','熟悉需求分析流程','具备基础数据能力']},
  {id:8,title:'平台产品专家',company:'云舟出行',city:'北京',experience:'5年以上',salary:'40-60K',salaryMin:40,tags:['平台产品','B端产品','项目管理'],age:6,color:'#4a5578',desc:'规划中后台平台产品架构，沉淀跨业务可复用的通用能力。',requirements:['5 年以上平台产品经验','有复杂系统架构能力','能推动大型跨团队项目']},
  {id:9,title:'策略产品经理',company:'知微科技',city:'深圳',experience:'3-5年',salary:'28-42K',salaryMin:28,tags:['策略产品','数据分析','A/B测试'],age:1,color:'#406c55',desc:'负责推荐与分发策略产品，通过实验持续提升内容消费效率。',requirements:['具备数据敏感度','熟悉策略产品方法','有推荐系统经验优先']},
  {id:10,title:'产品运营经理',company:'拾光教育',city:'杭州',experience:'1-3年',salary:'16-24K',salaryMin:16,tags:['产品运营','用户研究','增长策略'],age:7,color:'#8a6845',desc:'连接产品和用户，建设用户反馈体系并推动核心功能渗透。',requirements:['有用户运营或产品运营经验','沟通表达能力出色','善于复盘和总结']},
  {id:11,title:'供应链产品经理',company:'海屿零售',city:'上海',experience:'5年以上',salary:'32-48K',salaryMin:32,tags:['供应链','B端产品','项目管理'],age:3,color:'#47707b',desc:'负责订单、库存与履约系统的产品规划，提升供应链协同效率。',requirements:['熟悉零售供应链流程','有中后台产品经验','具备系统性思考能力']},
  {id:12,title:'硬件产品经理',company:'启明智造',city:'深圳',experience:'3-5年',salary:'24-35K',salaryMin:24,tags:['智能硬件','用户研究','项目管理'],age:4,color:'#685b75',desc:'负责智能硬件产品定义与全生命周期管理，协同研发推动量产。',requirements:['有智能硬件落地经验','熟悉产品开发流程','具备市场与用户洞察力']}
];

const provinceCityMap = {
  北京:['北京'],天津:['天津'],上海:['上海'],重庆:['重庆'],
  河北:['石家庄','唐山','秦皇岛','邯郸','邢台','保定','张家口','承德','沧州','廊坊','衡水','雄安'],
  山西:['太原','大同','阳泉','长治','晋城','朔州','晋中','运城','忻州','临汾','吕梁'],
  内蒙古:['呼和浩特','包头','乌海','赤峰','通辽','鄂尔多斯','呼伦贝尔','巴彦淖尔','乌兰察布'],
  辽宁:['沈阳','大连','鞍山','抚顺','本溪','丹东','锦州','营口','阜新','辽阳','盘锦','铁岭','朝阳','葫芦岛'],
  吉林:['长春','吉林','四平','辽源','通化','白山','松原','白城','延边'],
  黑龙江:['哈尔滨','齐齐哈尔','鸡西','鹤岗','双鸭山','大庆','伊春','佳木斯','七台河','牡丹江','黑河','绥化'],
  江苏:['南京','无锡','徐州','常州','苏州','南通','连云港','淮安','盐城','扬州','镇江','泰州','宿迁','昆山'],
  浙江:['杭州','宁波','温州','嘉兴','湖州','绍兴','金华','衢州','舟山','台州','丽水','义乌'],
  安徽:['合肥','芜湖','蚌埠','淮南','马鞍山','淮北','铜陵','安庆','黄山','滁州','阜阳','宿州','六安','亳州','池州','宣城'],
  福建:['福州','厦门','莆田','三明','泉州','漳州','南平','龙岩','宁德'],
  江西:['南昌','景德镇','萍乡','九江','新余','鹰潭','赣州','吉安','宜春','抚州','上饶'],
  山东:['济南','青岛','淄博','枣庄','东营','烟台','潍坊','济宁','泰安','威海','日照','临沂','德州','聊城','滨州','菏泽'],
  河南:['郑州','开封','洛阳','平顶山','安阳','鹤壁','新乡','焦作','濮阳','许昌','漯河','三门峡','南阳','商丘','信阳','周口','驻马店','济源'],
  湖北:['武汉','黄石','十堰','宜昌','襄阳','鄂州','荆门','孝感','荆州','黄冈','咸宁','随州','恩施','仙桃','潜江','天门'],
  湖南:['长沙','株洲','湘潭','衡阳','邵阳','岳阳','常德','张家界','益阳','郴州','永州','怀化','娄底','湘西'],
  广东:['广州','韶关','深圳','珠海','汕头','佛山','江门','湛江','茂名','肇庆','惠州','梅州','汕尾','河源','阳江','清远','东莞','中山','潮州','揭阳','云浮'],
  广西:['南宁','柳州','桂林','梧州','北海','防城港','钦州','贵港','玉林','百色','贺州','河池','来宾','崇左'],
  海南:['海口','三亚','三沙','儋州','琼海','文昌','万宁','五指山','东方','澄迈'],
  四川:['成都','自贡','攀枝花','泸州','德阳','绵阳','广元','遂宁','内江','乐山','南充','眉山','宜宾','广安','达州','雅安','巴中','资阳','阿坝','甘孜','凉山'],
  贵州:['贵阳','六盘水','遵义','安顺','毕节','铜仁','黔西南','黔东南','黔南'],
  云南:['昆明','曲靖','玉溪','保山','昭通','丽江','普洱','临沧','楚雄','红河','文山','西双版纳','大理','德宏','怒江','迪庆'],
  西藏:['拉萨','日喀则','昌都','林芝','山南','那曲','阿里'],
  陕西:['西安','铜川','宝鸡','咸阳','渭南','延安','汉中','榆林','安康','商洛'],
  甘肃:['兰州','嘉峪关','金昌','白银','天水','武威','张掖','平凉','酒泉','庆阳','定西','陇南','临夏','甘南'],
  青海:['西宁','海东','海北','黄南','海南州','果洛','玉树','海西'],
  宁夏:['银川','石嘴山','吴忠','固原','中卫'],
  新疆:['乌鲁木齐','克拉玛依','吐鲁番','哈密','昌吉','博尔塔拉','巴音郭楞','阿克苏','克孜勒苏','喀什','和田','伊犁','塔城','阿勒泰','石河子'],
  香港:['香港'],澳门:['澳门'],台湾:['台北','新北','桃园','台中','台南','高雄','台湾']
};
const companyTypeOrder=['央企 / 国企','民企 / 私企','外企 / 合资','事业单位','银行 / 金融机构','社会组织','其他企业'];

function normalizeCompanyType(value){
  const text=String(value||'').replace(/\s+/g,'');if(!text)return '其他企业';
  if(/央国企|央企|国企|国有/.test(text))return '央企 / 国企';
  if(/民企|民营|私企/.test(text))return '民企 / 私企';
  if(/外企|外资|合资|港澳台资/.test(text))return '外企 / 合资';
  if(/事业单位/.test(text))return '事业单位';
  if(/银行|金融机构/.test(text))return '银行 / 金融机构';
  if(/社会组织|公益组织|社会团体/.test(text))return '社会组织';
  return '其他企业';
}

function companyTypeSource(job){
  const known=/央国企|央企|国企|国有|民企|民营|私企|外企|外资|合资|港澳台资|事业单位|银行|社会组织|公益组织|社会团体|股份\/集团\/混合/;
  return job.companyType||((job.tags||[]).find(tag=>known.test(String(tag)))||'');
}

function regionsFromLocation(location){
  const text=String(location||'').replace(/\s+/g,'');const provinces=[],cities=[];
  const nationwide=/全国|多地|地点不限|不限地点|远程/.test(text);
  Object.entries(provinceCityMap).forEach(([province,items])=>{
    const matches=items.filter(city=>text.includes(city));
    if(text.includes(province)||matches.length){provinces.push(province);matches.forEach(city=>{if(!cities.includes(city))cities.push(city)})}
  });
  return {provinces:[...new Set(provinces)],cities:[...new Set(cities)],nationwide};
}

function unpackJob(job,fields){
  if(!Array.isArray(job))return job;
  const names=Array.isArray(fields)&&fields.length?fields:['id','title','company','companyType','city','batch','audience','industry','updated','deadline','tags','desc','applicationUrl','sourceId','sourceName','color'];
  return Object.fromEntries(names.map((name,index)=>[name,job[index]]));
}

function normalizeJob(rawJob,fields){
  const job=unpackJob(rawJob,fields);
  const regions=regionsFromLocation(job.city);const rawType=companyTypeSource(job);const companyType=normalizeCompanyType(rawType);
  const tags=(Array.isArray(job.tags)?job.tags:[]).filter(tag=>normalizeCompanyType(tag)!==companyType||!companyTypeSource({tags:[tag]}));
  if(rawType)tags.unshift(companyType);
  const requirements=Array.isArray(job.requirements)&&job.requirements.length?job.requirements:[
    `招聘对象：${job.audience||'未注明'}`,
    `工作地点：${job.city||'未注明'}`,
    `企业类型：${companyType}`,
    `所属行业：${job.industry||'未注明'}`,
    `更新时间：${job.updated||'未注明'}`,
    `数据来源：${job.sourceName||'在线岗位库'}`
  ];
  return {...job,companyType,provinces:Array.isArray(job.provinces)&&job.provinces.length?job.provinces:regions.provinces,cities:Array.isArray(job.cities)&&job.cities.length?job.cities:regions.cities,nationwide:Boolean(job.nationwide||regions.nationwide),tags:[...new Set(tags)].slice(0,6),requirements};
}

let jobs = fallbackJobs.map(normalizeJob);
let trackerEntries = [];
let resumeVersions = [];
let jobDataLoaded=false,jobDataPromise=null,jobCachePromise=null,jobNetworkChecked=false;
const JOB_CACHE_DB='zlab-job-cache-v1',JOB_CACHE_STORE='datasets',JOB_CACHE_KEY='current';
const trackerStatuses = {saved:'已收藏',applied:'已投递',interview:'面试中',offer:'Offer',closed:'已结束'};

const $ = (id) => document.getElementById(id);
const value = (id) => ($(id)?.value || '').trim();
let saveTimer;
let activeJobs = [];
let visibleLimit = 60;

function toast(message){
  const el=$('toast'); el.textContent=message; el.classList.add('show');
  clearTimeout(el.timer); el.timer=setTimeout(()=>el.classList.remove('show'),2200);
}

function collectExtraEntries(){
  return Object.fromEntries(Object.entries(extraEntryConfig).map(([kind,config])=>{
    const entries=[...$(config.container).querySelectorAll('[data-extra-entry]')].map(card=>Object.fromEntries(config.fields.map(field=>[
      field.key,(card.querySelector(`[data-extra-field="${field.key}"]`)?.value||'').trim()
    ])));
    return [kind,entries];
  }));
}

function readResume(){ return {...Object.fromEntries(resumeFields.map(id=>[id,value(id)])),extraEntries:collectExtraEntries()}; }

function putText(id,text,fallback){ $(id).textContent=text||fallback; }

function renderList(id,text,fallback=''){
  const list=$(id); list.replaceChildren();
  const lines=(text||'').split(/\n+/).map(line=>line.replace(/^[•·\-–—\s]+/,'').trim()).filter(Boolean);
  (lines.length?lines:(fallback?[fallback]:[])).forEach(line=>{const li=document.createElement('li');li.textContent=line;list.append(li)});
  return lines;
}

function createExtraEditor(kind,entry,index){
  const config=extraEntryConfig[kind];
  const card=document.createElement('section');card.className='dynamic-entry-card';card.dataset.extraEntry=kind;card.dataset.extraIndex=index;
  const head=document.createElement('div');head.className='dynamic-entry-head';
  const title=document.createElement('h3');title.textContent=`${config.label}${config.start+index}`;
  const remove=document.createElement('button');remove.type='button';remove.className='remove-entry-button';remove.dataset.removeEntry=kind;remove.dataset.entryIndex=index;remove.textContent='删除';remove.setAttribute('aria-label',`删除${config.label}${config.start+index}`);
  head.append(title,remove);
  const grid=document.createElement('div');grid.className='form-grid';
  config.fields.forEach(field=>{
    const label=document.createElement('label');if(field.wide)label.className='wide';label.append(document.createTextNode(field.label));
    const control=document.createElement(field.textarea?'textarea':'input');control.dataset.extraField=field.key;control.placeholder=field.placeholder;control.value=entry?.[field.key]||'';
    if(field.textarea){control.rows=3}else{control.type='text'}
    label.append(control);grid.append(label);
  });
  card.append(head,grid);return card;
}

function setExtraEntries(extraEntries={}){
  Object.entries(extraEntryConfig).forEach(([kind,config])=>{
    const container=$(config.container);container.replaceChildren();
    const entries=Array.isArray(extraEntries?.[kind])?extraEntries[kind].slice(0,20):[];
    entries.forEach((entry,index)=>container.append(createExtraEditor(kind,entry,index)));
  });
}

function renderExtraPreview(kind,entries=[]){
  const config=extraEntryConfig[kind];const container=$(config.preview);container.replaceChildren();
  entries.filter(entry=>Object.values(entry).some(Boolean)).forEach(entry=>{
    const wrapper=document.createElement('div');wrapper.className='resume-entry dynamic-preview-entry';
    const head=document.createElement('div');head.className='experience-head';
    const main=document.createElement('div');const name=document.createElement('b');const subtitle=document.createElement('p');const period=document.createElement('time');
    if(kind==='works'){name.textContent=entry.company||'公司名称';subtitle.textContent=entry.title||'职位名称'}
    if(kind==='projects'){name.textContent=entry.name||'项目名称';subtitle.textContent=entry.role||'担任角色'}
    if(kind==='educations'){name.textContent=entry.school||'学校名称';subtitle.textContent=entry.degree||'专业 · 学历'}
    period.textContent=entry.period||'';main.append(name,subtitle);head.append(main,period);wrapper.append(head);
    if(kind==='educations'&&entry.gpa){const gpa=document.createElement('p');gpa.className='gpa-line';gpa.textContent=entry.gpa;wrapper.append(gpa)}
    if(entry.highlights){const list=document.createElement('ul');entry.highlights.split(/\n+/).map(line=>line.replace(/^[•·\-–—\s]+/,'').trim()).filter(Boolean).forEach(line=>{const li=document.createElement('li');li.textContent=line;list.append(li)});wrapper.append(list)}
    container.append(wrapper);
  });
}

function renderResume(){
  const data=readResume();
  putText('previewName',data.name,'你的姓名');
  putText('previewMonogram',data.name.slice(0,1),'你');
  putText('previewRoleEn',data.role ? `${data.role.toUpperCase()} · PROFILE` : 'CAREER PROFILE','CAREER PROFILE');
  $('previewMeta').textContent=[data.role,data.years,data.location].filter(Boolean).join(' · ')||'目标职位 · 工作年限 · 所在城市';
  putText('previewPhone',data.phone,'手机号码'); putText('previewEmail',data.email,'邮箱地址'); putText('previewWebsite',data.website,'个人主页');
  $('previewWebsite').hidden=!data.website; $('websiteDot').hidden=!data.website;
  putText('previewSummary',data.summary,'在左侧填写个人优势，这里会实时生成你的简历内容。');
  putText('previewCompany',data.company,'公司名称'); putText('previewJobTitle',data.jobTitle,'职位名称'); putText('previewJobPeriod',data.jobPeriod,'任职时间');
  putText('previewCompany2',data.company2,''); putText('previewJobTitle2',data.jobTitle2,''); putText('previewJobPeriod2',data.jobPeriod2,'');
  putText('previewProjectName',data.projectName,'项目名称'); putText('previewProjectRole',data.projectRole,'担任角色'); putText('previewProjectPeriod',data.projectPeriod,'项目时间');
  putText('previewSchool',data.school,'学校名称'); putText('previewDegree',data.degree,'专业 · 学历'); putText('previewEduPeriod',data.eduPeriod,'就读时间');
  putText('previewGpa',data.gpa,''); putText('previewCertificates',data.certificates,''); putText('previewLanguages',data.languages,'');

  const skillList=$('previewSkills'); skillList.replaceChildren();
  data.skills.split(/[,，、]/).map(s=>s.trim()).filter(Boolean).slice(0,10).forEach(skill=>{const span=document.createElement('span');span.textContent=skill;skillList.append(span)});
  const lines=renderList('previewHighlights',data.highlights,'在左侧补充可量化的工作成果。');
  renderList('previewHighlights2',data.highlights2);
  renderList('previewProjectHighlights',data.projectHighlights,'在左侧填写有代表性的项目成果。');
  renderList('previewEduHighlights',data.eduHighlights);
  renderExtraPreview('works',data.extraEntries.works);
  renderExtraPreview('projects',data.extraEntries.projects);
  renderExtraPreview('educations',data.extraEntries.educations);
  $('previewWork2').classList.toggle('is-empty',![data.company2,data.jobTitle2,data.jobPeriod2,data.highlights2].some(Boolean));
  $('projectSection').classList.toggle('is-empty',![data.projectName,data.projectRole,data.projectPeriod,data.projectHighlights].some(Boolean)&&!data.extraEntries.projects.some(entry=>Object.values(entry).some(Boolean)));
  $('educationSection').classList.toggle('is-empty',![data.school,data.degree,data.eduPeriod,data.gpa,data.eduHighlights].some(Boolean)&&!data.extraEntries.educations.some(entry=>Object.values(entry).some(Boolean)));
  $('extrasSection').classList.toggle('is-empty',![data.certificates,data.languages].some(Boolean));
  $('summaryCount').textContent=data.summary.length;

  const essentials=['name','role','phone','email','location','summary','skills','company','jobTitle','jobPeriod','highlights','school','degree','eduPeriod'];
  let filled=essentials.filter(key=>data[key]).length;
  if(data.summary.length>=50) filled+=1;
  if(lines.length>=2) filled+=1;
  const score=Math.round(filled/16*100);
  $('scoreNumber').textContent=score; document.querySelector('.score-badge').style.setProperty('--score',`${score}%`);
  const tip=!data.phone||!data.email?'先补齐手机和邮箱，方便招聘方联系你。':!data.highlights?'工作成果建议使用“动作 + 数据 + 结果”。':lines.length<2?'再补充 1–2 条量化成果，简历会更有说服力。':!data.skills?'加入与目标岗位相关的 5–8 个核心技能。':'内容已经比较完整，导出前请检查日期和错别字。';
  $('writingTip').querySelector('span').textContent=tip;
  putText('signalRole',data.role, '尚未设置目标职位');
  putText('signalSkills',data.skills ? `技能：${data.skills}` : '', '填写简历后匹配更准确');
}

function saveResume(){
  try{localStorage.setItem('zhida-resume',JSON.stringify(readResume()));$('saveStatus').textContent='已自动保存'}catch{$('saveStatus').textContent='仅当前页面有效'}
}

function scheduleSave(){
  $('saveStatus').textContent='正在保存…'; clearTimeout(saveTimer); saveTimer=setTimeout(saveResume,450);
}

function fillForm(data,{merge=false}={}){
  resumeFields.forEach(id=>{if(!merge||Object.prototype.hasOwnProperty.call(data,id))$(id).value=data[id]||''});
  if(!merge||Object.prototype.hasOwnProperty.call(data,'extraEntries'))setExtraEntries(data.extraEntries||{});
  renderResume();saveResume();
}

function setTemplate(template,notify=false){
  const selected=templateNames[template]?template:'ats';
  $('resumePaper').className=`resume-paper template-${selected}`;
  document.querySelectorAll('.template-option').forEach(button=>{const active=button.dataset.template===selected;button.classList.toggle('active',active);button.setAttribute('aria-checked',String(active))});
  $('activeTemplateName').textContent=templateNames[selected];
  localStorage.setItem('zhida-template',selected);
  if(notify)toast(`已应用“${templateNames[selected]}”模板，内容保持不变`);
}

function setAccent(color){
  const safe=/^#[0-9a-f]{6}$/i.test(color)?color:'#285f4c';
  $('accentColor').value=safe; $('resumePaper').style.setProperty('--accent',safe); localStorage.setItem('zhida-accent',safe);
}

function loadResume(){
  try{const saved=JSON.parse(localStorage.getItem('zhida-resume')||'{}');resumeFields.forEach(id=>{$(id).value=saved[id]||''});setExtraEntries(saved.extraEntries||{})}catch{setExtraEntries({})}
  setTemplate(localStorage.getItem('zhida-template')||'ats'); setAccent(localStorage.getItem('zhida-accent')||'#285f4c'); renderResume();
}

function saveBackup(){
  const payload={version:2,createdAt:new Date().toISOString(),template:localStorage.getItem('zhida-template')||'ats',accent:$('accentColor').value,data:readResume()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`职达简历-${value('name')||'未命名'}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),500);toast('简历副本已保存');
}

function loadProductState(){
  try{trackerEntries=JSON.parse(localStorage.getItem('zhida-tracker')||'[]');if(!Array.isArray(trackerEntries))trackerEntries=[]}catch{trackerEntries=[]}
  try{resumeVersions=JSON.parse(localStorage.getItem('zhida-resume-versions')||'[]');if(!Array.isArray(resumeVersions))resumeVersions=[]}catch{resumeVersions=[]}
  renderVersionOptions();updateTrackerCount();
}

function persistTracker(){localStorage.setItem('zhida-tracker',JSON.stringify(trackerEntries));updateTrackerCount()}
function persistVersions(){localStorage.setItem('zhida-resume-versions',JSON.stringify(resumeVersions));renderVersionOptions()}

function renderVersionOptions(selected='current'){
  const select=$('resumeVersionSelect');if(!select)return;select.replaceChildren();
  const current=document.createElement('option');current.value='current';current.textContent='当前简历';select.append(current);
  resumeVersions.forEach(version=>{const option=document.createElement('option');option.value=version.id;option.textContent=version.name;select.append(option)});select.value=selected;
}

function createResumeVersion(name,data=readResume(),jobId=''){
  const id=`v-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
  resumeVersions.unshift({id,name,jobId,createdAt:new Date().toISOString(),template:localStorage.getItem('zhida-template')||'ats',accent:$('accentColor').value,data});
  resumeVersions=resumeVersions.slice(0,30);persistVersions();return id;
}

function saveManualVersion(){
  const defaultName=`${value('role')||'通用'}简历 · ${new Date().toLocaleDateString('zh-CN')}`;
  const name=prompt('给这个简历版本起个名字',defaultName);if(!name)return;
  const id=createResumeVersion(name.trim()||defaultName);renderVersionOptions(id);toast('新的简历版本已保存');
}

function openResumeVersion(id){
  if(id==='current')return;const version=resumeVersions.find(item=>item.id===id);if(!version)return;
  fillForm(version.data);setTemplate(version.template||'ats');setAccent(version.accent||'#285f4c');toast(`已打开“${version.name}”`);
}

function labeledValue(text,labels){
  const pattern=new RegExp(`(?:^|\\n)\\s*(?:${labels})\\s*[：:]\\s*([^\\n]+)`,'i');
  return (text.match(pattern)?.[1]||'').trim();
}

function sectionText(text,label,nextLabels){
  const pattern=new RegExp(`(?:^|\\n)\\s*(?:${label})\\s*[：:]?\\s*\\n?([\\s\\S]*?)(?=\\n\\s*(?:${nextLabels})\\s*[：:]?\\s*(?:\\n|$)|$)`,'i');
  return (text.match(pattern)?.[1]||'').trim();
}

function cleanBullets(text){return text.split(/\n+/).map(line=>line.trim()).filter(line=>line&&!/^(工作经历|实习经历|项目经历|教育经历|个人优势|自我评价|技能|证书|语言)/.test(line)).slice(0,6).join('\n')}

function parseResumeText(raw){
  const text=raw.replace(/\r/g,'').replace(/[\t ]+/g,' ').replace(/\n{3,}/g,'\n\n').trim();
  const lines=text.split('\n').map(line=>line.trim()).filter(Boolean);
  const email=text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0]||'';
  const phone=text.match(/(?:\+?86[-\s]?)?1[3-9]\d(?:[-\s]?\d){8}/)?.[0]||'';
  const name=labeledValue(text,'姓名|名字')||lines.find(line=>/^[\u4e00-\u9fa5·]{2,8}$/.test(line)&&!/(简历|求职|个人)/.test(line))||'';
  const work=sectionText(text,'工作经历|实习经历','项目经历|教育经历|校园经历|个人优势|自我评价|技能|证书|语言能力');
  const project=sectionText(text,'项目经历|项目经验','教育经历|校园经历|个人优势|自我评价|技能|证书|语言能力');
  const education=sectionText(text,'教育经历|教育背景','项目经历|工作经历|个人优势|自我评价|技能|证书|语言能力');
  const summary=sectionText(text,'个人优势|自我评价|个人简介','工作经历|实习经历|项目经历|教育经历|技能|证书|语言能力');
  const schoolLine=lines.find(line=>/(大学|学院)/.test(line))||'';
  const degreeLine=lines.find(line=>/(博士|硕士|本科|大专|专科)/.test(line))||'';
  const datePattern='(?:19|20)\\d{2}[.\\-/年](?:0?[1-9]|1[0-2])?(?:月)?\\s*(?:—|-|至|~)\\s*(?:至今|现在|(?:19|20)\\d{2}[.\\-/年](?:0?[1-9]|1[0-2])?(?:月)?)';
  const workLines=work.split('\n').map(line=>line.trim()).filter(Boolean);
  const projectLines=project.split('\n').map(line=>line.trim()).filter(Boolean);
  const companyLine=workLines.find(line=>/(公司|集团|科技|网络|银行|事务所|研究院|中心)/.test(line))||'';
  const jobLine=workLines.find(line=>line!==companyLine&&!new RegExp(datePattern).test(line)&&line.length<28&&!/^[•·\-]/.test(line))||'';
  const projectName=projectLines.find(line=>line.length<35&&!new RegExp(datePattern).test(line)&&!/^[•·\-]/.test(line))||'';
  const data={
    name,role:labeledValue(text,'求职意向|目标职位|应聘职位|职位目标'),phone:labeledValue(text,'手机|电话|联系方式')||phone,email:labeledValue(text,'邮箱|电子邮箱|E-mail')||email,
    location:labeledValue(text,'所在城市|现居地|所在地|城市'),years:labeledValue(text,'工作年限|工作经验|毕业年份|届别'),website:labeledValue(text,'个人主页|作品集|博客|Github|GitHub'),
    summary:labeledValue(text,'个人优势|自我评价|个人简介')||summary,skills:labeledValue(text,'核心技能|专业技能|技能特长|技能'),
    company:labeledValue(text,'公司|单位')||companyLine,jobTitle:labeledValue(text,'职位|岗位')||jobLine,jobPeriod:work.match(new RegExp(datePattern))?.[0]||'',highlights:cleanBullets(workLines.filter(line=>![companyLine,jobLine].includes(line)&&!new RegExp(datePattern).test(line)).join('\n')),
    projectName:labeledValue(text,'项目名称')||projectName,projectRole:labeledValue(text,'项目角色|担任角色'),projectPeriod:project.match(new RegExp(datePattern))?.[0]||'',projectHighlights:cleanBullets(projectLines.filter(line=>line!==projectName&&!new RegExp(datePattern).test(line)).join('\n')),
    school:labeledValue(text,'学校|毕业院校')||schoolLine,degree:labeledValue(text,'专业学历|专业|学历')||degreeLine,eduPeriod:education.match(new RegExp(datePattern))?.[0]||'',gpa:labeledValue(text,'GPA|成绩|排名'),eduHighlights:cleanBullets(education.split('\n').filter(line=>![schoolLine,degreeLine].includes(line)&&!new RegExp(datePattern).test(line)).join('\n')),
    certificates:labeledValue(text,'证书|证书奖项|奖项'),languages:labeledValue(text,'语言能力|外语水平|语言')
  };
  return Object.fromEntries(Object.entries(data).filter(([,val])=>val&&val.trim()));
}

async function extractFile(file){
  if(file.size>10*1024*1024)throw new Error('文件超过 10MB');
  const ext=file.name.split('.').pop().toLowerCase();
  if(ext==='json')return {kind:'data',value:JSON.parse(await file.text())};
  if(['txt','md'].includes(ext))return {kind:'text',value:await file.text()};
  if(ext==='docx'){
    if(!window.mammoth)throw new Error('Word 解析组件加载失败，请刷新后重试');
    const result=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});return {kind:'text',value:result.value};
  }
  if(ext==='pdf'){
    if(!window.pdfjsLib)throw new Error('PDF 解析组件加载失败，请刷新后重试');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc='vendor/pdf.worker.min.js';
    const pdf=await window.pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;const pages=[];
    for(let pageNo=1;pageNo<=Math.min(pdf.numPages,8);pageNo++){const page=await pdf.getPage(pageNo);const content=await page.getTextContent();pages.push(content.items.map(item=>item.str).join(' '))}
    return {kind:'text',value:pages.join('\n')};
  }
  throw new Error('暂不支持这种文件格式');
}

async function importSource(source){
  let parsed,template,accent;
  if(source.kind==='data'){
    const payload=source.value;parsed=payload.data||payload;template=payload.template;accent=payload.accent;
  }else parsed=parseResumeText(source.value);
  const count=Object.keys(parsed).filter(key=>resumeFields.includes(key)).length;
  if(!count)throw new Error('没有识别出可填写的简历信息，请换一种格式或直接粘贴文字');
  fillForm(parsed,{merge:true});if(template)setTemplate(template);if(accent)setAccent(accent);
  $('parsePreview').hidden=false;$('parseSummary').textContent=`识别出 ${count} 项信息，已填入右侧模板，你可以继续修改。`;
  setTimeout(()=>{$('importDialog').close();toast(`已识别 ${count} 项信息并生成简历`)},650);
}

function profileTokens(){
  const data=readResume();
  return `${data.role} ${data.skills} ${data.summary} ${data.jobTitle} ${data.highlights} ${data.jobTitle2} ${data.highlights2} ${data.projectRole} ${data.projectHighlights} ${data.degree} ${data.certificates} ${JSON.stringify(data.extraEntries)}`.toLowerCase();
}

const searchVocabulary = [
  '供应链','智能硬件','硬件','工程师','产品经理','产品运营','用户增长','商业化',
  '数据产品','平台产品','策略产品','ai','saas','b端','c端','增长','运营','数据',
  '项目管理','用户研究','研发','技术','算法','芯片','软件','市场','设计','职能',
  '实习','秋招','春招','校招','本科','硕士','博士','上海','北京','深圳','杭州','广州','成都'
].sort((a,b)=>b.length-a.length);

function searchTerms(input){
  const normalized=input.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}+#.]+/gu,' ').trim();
  if(!normalized)return [];
  const compact=normalized.replace(/\s+/g,'');
  const discovered=searchVocabulary.filter(term=>compact.includes(term));
  const specific=discovered.filter(term=>!discovered.some(other=>other!==term&&other.includes(term)));
  const latin=normalized.split(/\s+/).filter(term=>/^[a-z0-9+#.]{2,}$/i.test(term));
  const chinese=normalized.split(/\s+/).filter(term=>/[\p{Script=Han}]/u.test(term)&&term.length>=2);
  return [...new Set([...specific,...latin,...chinese])];
}

function relevanceFor(job,terms){
  if(!terms.length)return 1;
  const title=job.title.toLowerCase(), tags=(job.tags||[]).join(' ').toLowerCase(), all=`${title} ${job.company} ${tags} ${job.desc} ${job.industry||''} ${job.batch||''} ${job.audience||''} ${job.city||''}`.toLowerCase();
  return terms.reduce((score,term)=>score+(title.includes(term)?7:tags.includes(term)?5:all.includes(term)?2:0),0);
}

function matchFor(job,terms=[]){
  const profile=profileTokens();
  let score=profile.trim()?56:68;
  if(value('role') && job.title.includes(value('role'))) score+=12;
  job.tags.forEach(tag=>{if(profile.includes(tag.toLowerCase())) score+=7});
  if(value('location') && (job.city||'').includes(value('location'))) score+=4;
  score+=Math.min(relevanceFor(job,terms),16);
  return Math.min(score,97);
}

function analyzeJob(job){
  const source=[...(job.tags||[]),...searchTerms(`${job.title} ${job.desc||''} ${(job.requirements||[]).join(' ')}`)];
  const unique=new Map();source.map(term=>String(term).trim()).filter(term=>term.length>1).forEach(term=>{const key=term.toLowerCase();if(!unique.has(key))unique.set(key,term)});const keywords=[...unique.values()].slice(0,12);
  const profile=profileTokens();
  const covered=keywords.filter(term=>profile.includes(term.toLowerCase()));
  const missing=keywords.filter(term=>!profile.includes(term.toLowerCase()));
  const base=keywords.length?Math.round(covered.length/keywords.length*68)+24:matchFor(job);
  if(value('role')&&job.title.includes(value('role')))covered.unshift('目标职位');
  return {covered:[...new Set(covered)],missing,score:Math.min(97,Math.max(24,base))};
}

function trackedJob(id){return trackerEntries.find(entry=>String(entry.id)===String(id))}
function updateTrackerCount(){if($('trackerNavCount'))$('trackerNavCount').textContent=trackerEntries.length}

function addTrackedJob(job,status='saved'){
  const existing=trackedJob(job.id);if(existing)return existing;
  const entry={id:String(job.id),title:job.title||'',company:job.company||'',city:job.city||'',batch:job.batch||job.experience||'',audience:job.audience||'',deadline:job.deadline||'',applicationUrl:job.applicationUrl||bossSearchUrl(job),desc:job.desc||'',tags:job.tags||[],status,note:'',savedAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  trackerEntries.unshift(entry);persistTracker();return entry;
}

function beginApplication(job){
  addTrackedJob(job,'saved');
  localStorage.setItem('zhida-pending-application',JSON.stringify({id:String(job.id),openedAt:Date.now()}));
  if($('jobDialog').open)$('jobDialog').close();
  renderJobs(false);renderTracker();toast('投递页已打开，返回后请确认是否完成');
}

function pendingApplication(){try{return JSON.parse(localStorage.getItem('zhida-pending-application')||'null')}catch{return null}}

function checkPendingApplication(){
  const pending=pendingApplication();if(!pending||document.visibilityState==='hidden'||Date.now()-pending.openedAt<1000||$('applicationConfirm').open)return;
  const entry=trackedJob(pending.id);if(!entry||entry.status!=='saved'){localStorage.removeItem('zhida-pending-application');return}
  $('applicationConfirmJob').textContent=`${entry.company} · ${entry.title}。确认后会移动到“已投递”，未完成则继续留在“已收藏”。`;
  $('applicationConfirm').showModal();
}

function resolveApplication(done){
  const pending=pendingApplication();const entry=pending?trackedJob(pending.id):null;
  if(done&&entry){updateTrackedEntry(entry.id,{status:'applied'},false);renderTracker();toast('已标记为“已投递”')}
  else if(entry)toast('岗位继续保留在“已收藏”');
  localStorage.removeItem('zhida-pending-application');if($('applicationConfirm').open)$('applicationConfirm').close();
}

function toggleTrackedJob(job){
  const existing=trackedJob(job.id);
  if(existing){trackerEntries=trackerEntries.filter(entry=>String(entry.id)!==String(job.id));persistTracker();toast('已取消收藏')}
  else{addTrackedJob(job);toast('岗位已收藏，可在投递看板中管理')}
  renderJobs(false);renderTracker();
}

function trackerCard(entry){
  const card=document.createElement('article');card.className='tracker-card';card.dataset.trackId=entry.id;
  const title=document.createElement('h3');title.textContent=entry.title;const company=document.createElement('p');company.className='tracker-company';company.textContent=entry.company||'公司未注明';
  const meta=document.createElement('div');meta.className='tracker-meta';[entry.city,entry.batch,entry.deadline?`截止 ${entry.deadline}`:''].filter(Boolean).forEach(text=>{const span=document.createElement('span');span.textContent=text;meta.append(span)});
  const select=document.createElement('select');select.className='tracker-status';select.setAttribute('aria-label','投递状态');Object.entries(trackerStatuses).forEach(([key,label])=>{const option=document.createElement('option');option.value=key;option.textContent=label;select.append(option)});select.value=entry.status;
  const note=document.createElement('textarea');note.className='tracker-note';note.rows=2;note.placeholder='添加面试时间、联系人或跟进备注';note.value=entry.note||'';
  const footer=document.createElement('footer');const detail=document.createElement('button');detail.type='button';detail.className='open-track';detail.textContent='查看岗位';const remove=document.createElement('button');remove.type='button';remove.className='remove-track';remove.textContent='移除';footer.append(detail,remove);
  card.append(title,company,meta,select,note,footer);return card;
}

function renderTracker(){
  if(!$('trackerBoard'))return;const keyword=value('trackerSearch').toLowerCase();const filtered=trackerEntries.filter(entry=>!keyword||`${entry.title} ${entry.company} ${entry.city}`.toLowerCase().includes(keyword));
  Object.keys(trackerStatuses).forEach(status=>{const list=$(`list${status[0].toUpperCase()}${status.slice(1)}`);list.replaceChildren();const entries=filtered.filter(entry=>entry.status===status);entries.forEach(entry=>list.append(trackerCard(entry)));const count=$(`count${status[0].toUpperCase()}${status.slice(1)}`);if(count)count.textContent=entries.length});
  $('statAll').textContent=trackerEntries.length;$('statApplied').textContent=trackerEntries.filter(entry=>['applied','interview','offer','closed'].includes(entry.status)).length;$('statInterview').textContent=trackerEntries.filter(entry=>entry.status==='interview').length;$('statOffer').textContent=trackerEntries.filter(entry=>entry.status==='offer').length;
  $('trackerEmpty').hidden=trackerEntries.length>0;$('trackerBoard').hidden=trackerEntries.length===0;updateTrackerCount();
}

function updateTrackedEntry(id,changes,rerender=true){const entry=trackedJob(id);if(!entry)return;Object.assign(entry,changes,{updatedAt:new Date().toISOString()});persistTracker();if(rerender)renderTracker()}

function exportTracker(){
  if(!trackerEntries.length){toast('还没有可导出的求职记录');return}
  const escape=value=>`"${String(value??'').replace(/"/g,'""')}"`;const rows=[['公司','岗位','城市','状态','截止时间','备注','岗位链接'],...trackerEntries.map(entry=>[entry.company,entry.title,entry.city,trackerStatuses[entry.status],entry.deadline,entry.note,entry.applicationUrl])];
  const blob=new Blob(['\ufeff'+rows.map(row=>row.map(escape).join(',')).join('\n')],{type:'text/csv;charset=utf-8'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`职达求职记录-${new Date().toISOString().slice(0,10)}.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),500);toast('求职记录已导出');
}

function tailorResumeForJob(job){
  const base=readResume();if(!base.name&&!base.summary&&!base.skills){$('jobDialog').close();switchView('resume');toast('请先填写或上传一份基础简历');return}
  const analysis=analyzeJob(job);const skills=base.skills.split(/[,，、]/).map(item=>item.trim()).filter(Boolean);skills.sort((a,b)=>Number(analysis.covered.some(term=>a.toLowerCase().includes(term.toLowerCase()))) - Number(analysis.covered.some(term=>b.toLowerCase().includes(term.toLowerCase())))).reverse();
  const baseId=createResumeVersion(`原始简历备份 · ${new Date().toLocaleDateString('zh-CN')}`,base);
  const tailored={...base,role:job.title,skills:skills.join(', ')};const versionId=createResumeVersion(`${job.company} · ${job.title}`,tailored,job.id);
  fillForm(tailored);renderVersionOptions(versionId);addTrackedJob(job,'saved');$('jobDialog').close();switchView('resume');toast(`已生成岗位定制版，原简历保存在“${resumeVersions.find(v=>v.id===baseId).name}”`);
}

function openJobCache(){
  return new Promise((resolve,reject)=>{if(!('indexedDB'in window)){reject(new Error('IndexedDB unavailable'));return}const request=indexedDB.open(JOB_CACHE_DB,1);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(JOB_CACHE_STORE))request.result.createObjectStore(JOB_CACHE_STORE)};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
}

async function readJobCache(){
  const db=await openJobCache();try{return await new Promise((resolve,reject)=>{const request=db.transaction(JOB_CACHE_STORE,'readonly').objectStore(JOB_CACHE_STORE).get(JOB_CACHE_KEY);request.onsuccess=()=>resolve(request.result||null);request.onerror=()=>reject(request.error)})}finally{db.close()}
}

async function writeJobCache(dataset){
  const db=await openJobCache();try{await new Promise((resolve,reject)=>{const transaction=db.transaction(JOB_CACHE_STORE,'readwrite');transaction.objectStore(JOB_CACHE_STORE).put(dataset,JOB_CACHE_KEY);transaction.oncomplete=()=>resolve();transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error)})}finally{db.close()}
}

function jobSourceLabel(dataset,cached=false){
  const updated=new Date(dataset.generatedAt),source=dataset.source||'在线岗位库';
  const base=Number.isNaN(updated.getTime())?`已连接${source}`:`${source} · 同步于 ${updated.toLocaleString('zh-CN',{hour12:false})}`;
  return `${base}${cached?' · 已快速载入本地缓存':''} · 每 2 小时更新 · ${jobs.length.toLocaleString('zh-CN')} 条`;
}

function applyJobDataset(dataset,cached=false){
  if(!Array.isArray(dataset.jobs)||!dataset.jobs.length)throw new Error('岗位数据为空');
  jobs=dataset.normalized?dataset.jobs:dataset.jobs.map(job=>normalizeJob(job,dataset.fields));jobDataLoaded=true;populateJobFilters();
  $('dataSourceStatus').textContent=jobSourceLabel(dataset,cached);updateLabJobCounts();
}

async function restoreCachedJobs(){
  try{const cached=await readJobCache();if(!cached||!Array.isArray(cached.jobs)||!cached.jobs.length)return false;applyJobDataset(cached,true);if($('jobsView').classList.contains('active'))renderJobs(false);return true}catch{return false}
}

function waitForJobIdle(){
  if(!('requestIdleCallback'in window))return Promise.resolve();
  return new Promise(resolve=>requestIdleCallback(resolve,{timeout:1200}));
}

function loadOnlineJobs(force=false){
  if(jobDataLoaded&&jobNetworkChecked&&!force)return Promise.resolve(true);if(jobDataPromise)return jobDataPromise;
  $('dataSourceStatus').textContent=jobDataLoaded?'正在检查岗位库更新…':'正在载入完整岗位库，请稍候…';
  jobDataPromise=(async()=>{const hadOnlineData=jobDataLoaded;try{
      const response=await fetch('/jobs-data.json',{cache:force?'reload':'default'});if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const text=await response.text();if(hadOnlineData)await waitForJobIdle();const payload=JSON.parse(text);if(!Array.isArray(payload.jobs)||!payload.jobs.length)throw new Error('岗位数据为空');
      applyJobDataset(payload,false);jobNetworkChecked=true;
      const cached={normalized:true,generatedAt:payload.generatedAt,source:payload.source,jobs,savedAt:Date.now()};writeJobCache(cached).catch(()=>{});return true;
    }catch(error){
      console.warn('Online job data unavailable',error);if(!hadOnlineData){jobs=fallbackJobs;$('dataSourceStatus').textContent='在线岗位库加载失败，当前显示本地备用岗位'}else $('dataSourceStatus').textContent='本次更新暂时失败，继续显示上次岗位数据';updateLabJobCounts();return false;
    }finally{jobDataPromise=null}})();
  return jobDataPromise;
}

async function loadJobsForView(){
  if(jobCachePromise)await jobCachePromise;
  if(jobDataLoaded){loadOnlineJobs(false).then(()=>{if($('jobsView').classList.contains('active'))renderJobs(false)});return true}
  return loadOnlineJobs(false);
}

function updateLabJobCounts(){
  const count=jobs.length.toLocaleString('zh-CN');
  if($('homeJobCount'))$('homeJobCount').textContent=count;
}

async function registerVisit(){
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),4000);
  try{const response=await fetch('/api/visit',{method:'POST',headers:{Accept:'application/json'},cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();const count=Number(data.count);if(!Number.isFinite(count)||count<0)throw new Error('Invalid count');$('visitorCount').textContent=count.toLocaleString('zh-CN')}catch{$('visitorCount').textContent='—'}finally{clearTimeout(timeout)}
}

function updatedValue(value){
  const match=String(value||'').match(/(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
  return match?Number(`${match[1]}${match[2].padStart(2,'0')}${match[3].padStart(2,'0')}`):0;
}

function replaceFilterOptions(id,firstLabel,entries,selected='all'){
  const select=$(id);select.replaceChildren();const first=document.createElement('option');first.value='all';first.textContent=firstLabel;select.append(first);
  entries.forEach(([value,count])=>{const option=document.createElement('option');option.value=value;option.textContent=`${value}（${count.toLocaleString('zh-CN')}）`;select.append(option)});
  select.value=[...select.options].some(option=>option.value===selected)?selected:'all';
}

function countedValues(source,getValues){
  const counts=new Map();source.forEach(job=>[...new Set(getValues(job).filter(Boolean))].forEach(item=>counts.set(item,(counts.get(item)||0)+1)));return counts;
}

function populateCityFilter(){
  const selected=value('cityFilter')||'all',province=value('provinceFilter')||'all';
  const relevant=province==='all'?jobs:jobs.filter(job=>province==='全国 / 多地'?job.nationwide:(job.provinces||[]).includes(province));
  const counts=countedValues(relevant,job=>job.cities||[]);const order=Object.values(provinceCityMap).flat();
  const entries=[...counts.entries()].sort((a,b)=>{const ai=order.indexOf(a[0]),bi=order.indexOf(b[0]);return (ai<0?9999:ai)-(bi<0?9999:bi)||b[1]-a[1]});
  replaceFilterOptions('cityFilter',province==='all'?'全部城市':`${province} · 全部城市`,entries,selected);
}

function populateJobFilters(){
  const selectedProvince=value('provinceFilter')||'all',selectedType=value('companyTypeFilter')||'all';
  const provinceCounts=countedValues(jobs,job=>[...(job.provinces||[]),...(job.nationwide?['全国 / 多地']:[])]);
  const provinceOrder=[...Object.keys(provinceCityMap),'全国 / 多地'];
  const provinces=[...provinceCounts.entries()].sort((a,b)=>provinceOrder.indexOf(a[0])-provinceOrder.indexOf(b[0]));
  replaceFilterOptions('provinceFilter','全国',provinces,selectedProvince);
  const typeCounts=countedValues(jobs,job=>[job.companyType||'其他企业']);
  const types=[...typeCounts.entries()].sort((a,b)=>companyTypeOrder.indexOf(a[0])-companyTypeOrder.indexOf(b[0]));
  replaceFilterOptions('companyTypeFilter','全部类型',types,selectedType);populateCityFilter();
}

function renderJobs(resetLimit=true){
  if(resetLimit)visibleLimit=60;
  const rawKeyword=value('jobKeyword'),keyword=rawKeyword.toLowerCase().normalize('NFKC').replace(/\s+/g,' ').trim(),compactKeyword=keyword.replace(/\s+/g,'');
  const terms=searchTerms(rawKeyword);
  const province=$('provinceFilter').value,city=$('cityFilter').value,companyType=$('companyTypeFilter').value,batch=$('batchFilter').value,audience=$('audienceFilter').value,sort=$('sortFilter').value;
  activeJobs=jobs.filter(job=>{
    const haystack=`${job.title} ${job.company} ${(job.tags||[]).join(' ')} ${job.desc||''} ${job.industry||''} ${job.batch||''} ${job.audience||''} ${job.city||''}`.toLowerCase().normalize('NFKC'),compactHaystack=haystack.replace(/\s+/g,'');
    const relevance=relevanceFor(job,terms);
    const provinceMatch=province==='all'||(province==='全国 / 多地'?job.nationwide:(job.provinces||[]).includes(province));
    return (!keyword||compactHaystack.includes(compactKeyword)||relevance>0)&&provinceMatch&&(city==='all'||(job.cities||[]).includes(city))&&(companyType==='all'||job.companyType===companyType)&&(batch==='all'||(job.batch||'').includes(batch))&&(audience==='all'||(job.audience||'').includes(audience));
  }).map(job=>({...job,relevance:relevanceFor(job,terms),match:analyzeJob(job).score}));
  activeJobs.sort((a,b)=>sort==='updated'?updatedValue(b.updated)-updatedValue(a.updated):sort==='company'?(a.company||'').localeCompare(b.company||'','zh-CN'):keyword?(b.relevance-a.relevance||b.match-a.match):b.match-a.match);
  $('resultCount').textContent=`${activeJobs.length} 个匹配岗位`;
  const shown=Math.min(visibleLimit,activeJobs.length);
  const appliedFilters=[province!=='all'?province:'',city!=='all'?city:'',companyType!=='all'?companyType:''].filter(Boolean);
  $('resultSummary').textContent=`${keyword?`“${rawKeyword}” · `:''}${appliedFilters.length?`${appliedFilters.join(' · ')} · `:''}当前显示 ${shown} 条${jobDataLoaded?'':' · 完整岗位库仍在加载'}`;
  const grid=$('jobGrid'); grid.replaceChildren();
  activeJobs.slice(0,visibleLimit).forEach(job=>{
    const card=document.createElement('article');card.className='job-card';card.style.setProperty('--logo',job.color);card.style.setProperty('--match',`${job.match}%`);
    card.innerHTML=`<div class="job-card-top"><div class="company-logo"></div><div><h2></h2><p class="company"></p></div><strong class="salary"></strong><button class="save-job" data-save-job="${job.id}" aria-label="收藏岗位">☆</button></div><div class="job-meta"><span></span><span></span><span></span></div><p class="job-description"></p><div class="job-tags"></div><div class="job-card-footer"><span class="match-value"><i></i>${job.match}% 匹配</span><button class="detail-button" data-job-id="${job.id}">查看详情 →</button></div>`;
    card.querySelector('.company-logo').textContent=(job.title||job.company||'岗').slice(0,1);card.querySelector('h2').textContent=job.title;card.querySelector('.company').textContent=job.company;card.querySelector('.salary').textContent=job.deadline?`截止 ${job.deadline}`:(job.salary||'');card.querySelector('.job-description').textContent=job.desc;
    const meta=card.querySelectorAll('.job-meta span');meta[0].textContent=job.city||'地点未注明';meta[1].textContent=job.batch||job.experience||'招聘';meta[2].textContent=(job.audience||'学历不限').replace(/\n/g,' / ');
    const saveButton=card.querySelector('.save-job');const tracked=Boolean(trackedJob(job.id));saveButton.textContent=tracked?'★':'☆';saveButton.classList.toggle('active',tracked);saveButton.setAttribute('aria-label',tracked?'取消收藏':'收藏岗位');
    const tags=card.querySelector('.job-tags');job.tags.forEach(tag=>{const el=document.createElement('span');el.textContent=tag;if(tag===job.companyType)el.className='job-type-chip';tags.append(el)});grid.append(card);
  });
  $('emptyState').hidden=activeJobs.length>0; grid.hidden=activeJobs.length===0;
  $('loadMore').hidden=activeJobs.length<=visibleLimit;
}

function bossSearchUrl(job){
  const cityCodes={上海:'101020100',北京:'101010100',深圳:'101280600',杭州:'101210100',广州:'101280100',成都:'101270100'};
  return `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(job.title)}&city=${cityCodes[job.city]||'100010000'}`;
}

function openJob(id){
  const job=jobs.find(item=>String(item.id)===String(id)); if(!job)return;
  const content=$('dialogContent');content.replaceChildren();
  const analysis=analyzeJob(job);
  const company=document.createElement('p');company.className='dialog-company';company.textContent=`${job.company} · ${job.city} · ${job.batch||job.experience||'招聘'}`;
  const title=document.createElement('h2');title.textContent=job.title;
  const salary=document.createElement('p');salary.className='dialog-salary';salary.textContent=job.deadline?`截止时间：${job.deadline}`:(job.salary||'');
  const match=document.createElement('section');match.className='job-match-panel';const matchHead=document.createElement('div');matchHead.className='match-panel-head';matchHead.innerHTML=`<div><span>简历匹配分析</span><b>${analysis.score}%</b></div><i style="--score:${analysis.score}%"></i>`;match.append(matchHead);
  const matchGroups=document.createElement('div');matchGroups.className='match-groups';
  const buildGroup=(label,items,type)=>{const group=document.createElement('div');const heading=document.createElement('p');heading.textContent=label;group.append(heading);const chips=document.createElement('div');chips.className=`match-chips ${type}`;(items.length?items:['暂无']).forEach(item=>{const chip=document.createElement('span');chip.textContent=item;chips.append(chip)});group.append(chips);return group};
  matchGroups.append(buildGroup('简历已覆盖',analysis.covered,'covered'),buildGroup('建议核实并补充',analysis.missing,'missing'));match.append(matchGroups);
  const intro=document.createElement('div');intro.className='dialog-section';intro.innerHTML='<h3>招聘岗位</h3>';const introP=document.createElement('p');introP.textContent=job.desc;intro.append(introP);
  const req=document.createElement('div');req.className='dialog-section';req.innerHTML='<h3>招聘信息</h3>';const ul=document.createElement('ul');(job.requirements||[]).forEach(text=>{const li=document.createElement('li');li.textContent=text;ul.append(li)});req.append(ul);
  const actions=document.createElement('div');actions.className='dialog-actions';
  const save=document.createElement('button');save.className='secondary-button dialog-save-job';save.type='button';save.textContent=trackedJob(job.id)?'★ 已收藏':'☆ 收藏岗位';save.addEventListener('click',()=>{toggleTrackedJob(job);save.textContent=trackedJob(job.id)?'★ 已收藏':'☆ 收藏岗位'});
  const tailor=document.createElement('button');tailor.className='primary-button';tailor.type='button';tailor.textContent='为此岗位制作简历';tailor.addEventListener('click',()=>tailorResumeForJob(job));
  const link=document.createElement('a');link.className='secondary-button';link.href=job.applicationUrl||bossSearchUrl(job);link.target='_blank';link.rel='noreferrer';link.textContent=job.applicationUrl?'官方投递 ↗':'搜索相似岗位 ↗';
  link.addEventListener('click',()=>beginApplication(job));
  actions.append(tailor,save,link);
  content.append(company,title,salary,match,intro,req,actions); $('jobDialog').showModal();
}

function encodeBase64(text){const bytes=new TextEncoder().encode(text);let binary='';bytes.forEach(byte=>binary+=String.fromCharCode(byte));return btoa(binary)}
function decodeBase64(text){const binary=atob(text.trim());const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));return new TextDecoder().decode(bytes)}

async function copyToolValue(id){
  const element=$(id);const text='value'in element?element.value:element.textContent;if(!text){toast('没有可复制的内容');return}
  try{await navigator.clipboard.writeText(text)}catch{if('select'in element){element.select();document.execCommand('copy')}}toast('已复制到剪贴板');
}

function setupToolbox(){
  const formatJson=compact=>{try{const parsed=JSON.parse($('jsonInput').value);$('jsonOutput').value=JSON.stringify(parsed,null,compact?0:2);$('jsonStatus').textContent=compact?'已压缩':'JSON 格式正确'}catch(error){$('jsonOutput').value='';$('jsonStatus').textContent=`格式错误：${error.message}`}};
  $('formatJson').addEventListener('click',()=>formatJson(false));$('minifyJson').addEventListener('click',()=>formatJson(true));
  $('jsonInput').addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter'){event.preventDefault();formatJson(false)}});
  const updateTextStats=()=>{const text=$('textStatsInput').value;const chinese=(text.match(/[\u3400-\u9fff]/g)||[]).length;const latin=(text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length;$('statChars').textContent=text.length;$('statNoSpace').textContent=text.replace(/\s/g,'').length;$('statWords').textContent=chinese+latin;$('statLines').textContent=text?text.split(/\n/).length:0};
  $('textStatsInput').addEventListener('input',updateTextStats);updateTextStats();
  const convertTime=()=>{const raw=$('timestampInput').value.trim();if(!raw){$('timestampOutput').textContent='请先输入时间戳或日期';return}let date;if(/^\d{10,13}$/.test(raw)){const number=Number(raw);date=new Date(raw.length===10?number*1000:number)}else date=new Date(raw);if(Number.isNaN(date.getTime())){$('timestampOutput').textContent='无法识别这个时间，请检查格式';return}$('timestampOutput').textContent=`本地时间：${date.toLocaleString('zh-CN',{hour12:false})}\nISO：${date.toISOString()}\nUnix 秒：${Math.floor(date.getTime()/1000)}`};
  $('convertTimestamp').addEventListener('click',convertTime);$('currentTimestamp').addEventListener('click',()=>{$('timestampInput').value=String(Date.now());convertTime()});
  $('runCodec').addEventListener('click',()=>{try{const input=$('codecInput').value;const mode=$('codecMode').value;const operations={base64Encode:encodeBase64,base64Decode:decodeBase64,urlEncode:encodeURIComponent,urlDecode:decodeURIComponent};$('codecOutput').value=operations[mode](input)}catch(error){$('codecOutput').value=`处理失败：${error.message}`}});
  const generatePassword=()=>{const length=Number($('passwordLength').value);let chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';if($('passwordNumbers').checked)chars+='23456789';if($('passwordSymbols').checked)chars+='!@#$%&*+-=?';const random=new Uint32Array(length);crypto.getRandomValues(random);$('passwordOutput').value=[...random].map(number=>chars[number%chars.length]).join('');const types=1+Number($('passwordNumbers').checked)+Number($('passwordSymbols').checked);$('passwordStrength').textContent=length>=18&&types>=3?'强度：高':length>=12&&types>=2?'强度：中':'强度：基础'};
  $('passwordLength').addEventListener('input',event=>{$('passwordLengthLabel').textContent=event.target.value});$('generatePassword').addEventListener('click',generatePassword);generatePassword();
  document.querySelectorAll('[data-copy-target]').forEach(button=>button.addEventListener('click',()=>copyToolValue(button.dataset.copyTarget)));
}

let studyState={tasks:[],sessions:{}};
let focusTimer=null,focusRemaining=25*60,focusTotal=25*60,focusRunning=false,focusBreak=false;
const localDateKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

function persistStudy(){try{localStorage.setItem('zlab-study',JSON.stringify(studyState))}catch{}}
function loadStudy(){
  try{const saved=JSON.parse(localStorage.getItem('zlab-study')||'{}');studyState={tasks:Array.isArray(saved.tasks)?saved.tasks:[],sessions:saved.sessions&&typeof saved.sessions==='object'?saved.sessions:{}}}catch{studyState={tasks:[],sessions:{}}}
}
function renderStudy(){
  const today=localDateKey();const todayRecord=studyState.sessions[today]||{minutes:0,count:0};const records=Object.values(studyState.sessions);const total=records.reduce((sum,item)=>sum+(Number(item.minutes)||0),0);
  $('studyTodayMinutes').textContent=`${todayRecord.minutes||0} 分钟`;$('studyTodaySessions').textContent=`${todayRecord.count||0} 次完成`;$('studyTotalMinutes').textContent=`${total} 分钟`;
  let streak=0;const cursor=new Date();while((studyState.sessions[localDateKey(cursor)]?.count||0)>0){streak++;cursor.setDate(cursor.getDate()-1)}$('studyStreak').textContent=`${streak} 天`;
  const done=studyState.tasks.filter(task=>task.done).length;$('studyTaskProgress').textContent=`${done} / ${studyState.tasks.length}`;$('studyTaskList').replaceChildren();
  if(!studyState.tasks.length){const empty=document.createElement('div');empty.className='study-task-empty';empty.textContent='还没有任务，先写下今天最重要的一件事。';$('studyTaskList').append(empty)}
  studyState.tasks.forEach(task=>{const row=document.createElement('label');row.className=`study-task-item${task.done?' done':''}`;row.dataset.taskId=task.id;const check=document.createElement('input');check.type='checkbox';check.checked=task.done;check.setAttribute('aria-label',`完成任务：${task.text}`);const text=document.createElement('span');text.textContent=task.text;const remove=document.createElement('button');remove.type='button';remove.dataset.removeStudyTask=task.id;remove.textContent='×';remove.setAttribute('aria-label',`删除任务：${task.text}`);row.append(check,text,remove);$('studyTaskList').append(row)});
  $('studyHeatmap').replaceChildren();for(let offset=55;offset>=0;offset--){const date=new Date();date.setDate(date.getDate()-offset);const key=localDateKey(date);const minutes=Number(studyState.sessions[key]?.minutes)||0;const level=minutes>=90?4:minutes>=60?3:minutes>=25?2:minutes>0?1:0;const cell=document.createElement('i');cell.className='study-day';cell.dataset.level=level;cell.title=`${key} · ${minutes} 分钟`;$('studyHeatmap').append(cell)}
}
function renderFocusTimer(){
  const minutes=String(Math.floor(focusRemaining/60)).padStart(2,'0');const seconds=String(focusRemaining%60).padStart(2,'0');$('focusTime').textContent=`${minutes}:${seconds}`;$('focusMode').textContent=focusBreak?'休息时间':'专注时间';$('focusClock').classList.toggle('is-break',focusBreak);$('focusClock').style.setProperty('--timer-progress',`${Math.max(0,(1-focusRemaining/focusTotal)*360)}deg`);$('focusStart').textContent=focusRunning?'暂停':focusRemaining<focusTotal?'继续':'开始专注';$('pomodoroDuration').disabled=focusRunning||focusBreak;
}
function resetFocusTimer(){clearInterval(focusTimer);focusTimer=null;focusRunning=false;focusBreak=false;focusTotal=Number($('pomodoroDuration').value)*60;focusRemaining=focusTotal;renderFocusTimer()}
function finishFocusPeriod(){
  clearInterval(focusTimer);focusTimer=null;focusRunning=false;
  if(!focusBreak){const minutes=Number($('pomodoroDuration').value);const key=localDateKey();const record=studyState.sessions[key]||{minutes:0,count:0};record.minutes+=minutes;record.count+=1;studyState.sessions[key]=record;persistStudy();renderStudy();focusBreak=true;focusTotal=5*60;focusRemaining=focusTotal;toast(`完成 ${minutes} 分钟专注，休息一下吧`)}else{focusBreak=false;focusTotal=Number($('pomodoroDuration').value)*60;focusRemaining=focusTotal;toast('休息结束，可以开始下一轮了')}renderFocusTimer();
}
function setupStudy(){
  loadStudy();renderStudy();resetFocusTimer();
  $('studyTaskForm').addEventListener('submit',event=>{event.preventDefault();const text=value('studyTaskInput');if(!text)return;studyState.tasks.unshift({id:String(Date.now()),text,done:false});$('studyTaskInput').value='';persistStudy();renderStudy()});
  $('studyTaskList').addEventListener('change',event=>{const row=event.target.closest('[data-task-id]');if(!row)return;const task=studyState.tasks.find(item=>String(item.id)===row.dataset.taskId);if(task){task.done=event.target.checked;persistStudy();renderStudy()}});
  $('studyTaskList').addEventListener('click',event=>{const remove=event.target.closest('[data-remove-study-task]');if(!remove)return;studyState.tasks=studyState.tasks.filter(task=>String(task.id)!==remove.dataset.removeStudyTask);persistStudy();renderStudy()});
  $('pomodoroDuration').addEventListener('change',resetFocusTimer);$('focusReset').addEventListener('click',resetFocusTimer);
  $('focusStart').addEventListener('click',()=>{if(focusRunning){clearInterval(focusTimer);focusTimer=null;focusRunning=false;renderFocusTimer();return}focusRunning=true;renderFocusTimer();focusTimer=setInterval(()=>{focusRemaining--;renderFocusTimer();if(focusRemaining<=0)finishFocusPeriod()},1000)});
  setupLearningExtras();
}

const quizBank=[
  {category:'计算机',question:'HTTP 状态码 404 表示什么？',options:['服务器内部错误','资源未找到','请求成功','需要登录'],answer:1,explain:'404 表示服务器无法找到请求的资源。'},
  {category:'英语',question:'“efficient” 最接近下面哪个中文含义？',options:['高效的','昂贵的','复杂的','临时的'],answer:0,explain:'efficient 表示“高效的、有效率的”。'},
  {category:'常识',question:'一年中白昼最长的一天通常接近哪个节气？',options:['冬至','春分','夏至','秋分'],answer:2,explain:'北半球白昼最长的一天通常在夏至附近。'},
  {category:'数学',question:'如果一个数增加 20% 后等于 120，原数是多少？',options:['80','96','100','110'],answer:2,explain:'原数 × 1.2 = 120，所以原数是 100。'},
  {category:'计算机',question:'JSON 中用于表示数组的符号是？',options:['{}','[]','()','<>'],answer:1,explain:'JSON 数组使用方括号 [] 表示。'},
  {category:'英语',question:'“deadline” 在工作场景中通常表示什么？',options:['起点','截止时间','会议地点','工资'],answer:1,explain:'deadline 表示任务或项目的截止时间。'},
  {category:'逻辑',question:'所有 A 都是 B，所有 B 都是 C，可以推出什么？',options:['所有 C 都是 A','有些 C 不是 B','所有 A 都是 C','A 与 C 无关'],answer:2,explain:'这是集合包含关系的传递：A ⊆ B ⊆ C。'},
  {category:'计算机',question:'CSS 主要负责网页的什么？',options:['数据存储','视觉样式','服务器认证','域名解析'],answer:1,explain:'CSS 负责网页布局、颜色、字体等视觉表现。'},
  {category:'英语',question:'“improve” 的反义方向最接近？',options:['提升','保持','恶化','比较'],answer:2,explain:'improve 是改善，反义方向是 worsen（恶化）。'},
  {category:'常识',question:'人体中负责泵送血液的器官是？',options:['肺','肝脏','心脏','肾脏'],answer:2,explain:'心脏通过收缩把血液泵送到全身。'},
  {category:'数学',question:'2、4、8、16 后面的数字是？',options:['18','24','30','32'],answer:3,explain:'每个数字都是前一个的 2 倍，所以是 32。'},
  {category:'计算机',question:'浏览器本地存储 localStorage 的数据通常何时消失？',options:['刷新页面后','关闭标签页后','主动清除时','每小时自动清除'],answer:2,explain:'localStorage 会持续保存，直到用户或程序主动清除。'}
];
const vocabularyDeckConfig={cet4:{label:'四级',file:'cet4',global:'ZLAB_CET4'},cet6:{label:'六级',file:'cet6',global:'ZLAB_CET6'},kaoyan:{label:'考研',file:'kaoyan',global:'ZLAB_KAOYAN'}};
const vocabularyCards={cet4:[],cet6:[],kaoyan:[]},vocabularyLoadState={cet4:'loading',cet6:'loading',kaoyan:'loading'},vocabularyLoadPromises={};
let learningState={cards:[],mistakes:[],quizIndex:0},flashcardIndex=0,flashDeck='cet6';
function persistLearning(){try{localStorage.setItem('zlab-learning',JSON.stringify(learningState))}catch{}}
function activeFlashcards(){return flashDeck==='custom'?learningState.cards:(vocabularyCards[flashDeck]||[])}
function renderFlashcard(){
  const cards=activeFlashcards(),isCustom=flashDeck==='custom',state=vocabularyLoadState[flashDeck],deckName=vocabularyDeckConfig[flashDeck]?.label||'';
  $('flashcardCount').textContent=isCustom?`${cards.length.toLocaleString('zh-CN')} 张`:state==='loading'?'载入中':state==='error'?'加载失败':`${cards.length.toLocaleString('zh-CN')} 词`;
  $('flashcard').classList.remove('flipped');$('flashDelete').disabled=!isCustom||!cards.length;
  if(!cards.length){
    $('flashcardFront').textContent=isCustom?'还没有自建卡片':state==='error'?'词库暂时加载失败':`正在载入${deckName}词库`;
    $('flashcardBack').textContent=isCustom?'在下方填写单词和释义即可添加':state==='error'?'请刷新页面后重试':'稍候即可开始复习';
    $('flashcardProgress').textContent=isCustom?'我的卡片会保存在当前浏览器':'准备词库中…';return;
  }
  flashcardIndex=(flashcardIndex+cards.length)%cards.length;const card=cards[flashcardIndex];
  $('flashcardFront').textContent=card.front;$('flashcardBack').textContent=card.back;
  $('flashcardProgress').textContent=`第 ${(flashcardIndex+1).toLocaleString('zh-CN')} / ${cards.length.toLocaleString('zh-CN')} ${isCustom?'张':'词'}`;
}
function loadVocabularyDeck(deck){
  const config=vocabularyDeckConfig[deck];if(!config)return Promise.resolve();if(vocabularyLoadPromises[deck])return vocabularyLoadPromises[deck];
  vocabularyLoadPromises[deck]=(async()=>{try{
      let data;
      if(location.protocol==='file:'){
        data=window[config.global];
        if(!data)data=await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=`data/${config.file}.js`;script.onload=()=>window[config.global]?resolve(window[config.global]):reject(new Error('Invalid local vocabulary'));script.onerror=()=>reject(new Error('Local vocabulary unavailable'));document.head.append(script)});
      }else{
        const response=await fetch(`data/${config.file}.json?v=20260727`,{cache:'force-cache'});if(!response.ok)throw new Error(`HTTP ${response.status}`);data=await response.json();
      }
      if(!Array.isArray(data.words))throw new Error('Invalid vocabulary');
      vocabularyCards[deck]=data.words.filter(item=>item&&item.word&&Array.isArray(item.translations)&&item.translations.length).map(item=>({front:String(item.word),back:[String(item.phonetic||'').trim(),item.translations.slice(0,3).map(String).join('；')].filter(Boolean).join(' · ')}));
      vocabularyLoadState[deck]='ready';if(flashDeck===deck&&vocabularyCards[deck].length)flashcardIndex=Math.floor(Math.random()*vocabularyCards[deck].length);if(flashDeck===deck)renderFlashcard();
    }catch{vocabularyLoadState[deck]='error';if(flashDeck===deck)renderFlashcard()}})();
  return vocabularyLoadPromises[deck];
}
function renderQuiz(){const quiz=quizBank[learningState.quizIndex%quizBank.length];$('quizCategory').textContent=quiz.category;$('quizNumber').textContent=String(learningState.quizIndex%quizBank.length+1).padStart(2,'0');$('quizQuestion').textContent=quiz.question;$('quizFeedback').textContent='选择一个你认为正确的答案。';$('quizOptions').replaceChildren();quiz.options.forEach((option,index)=>{const button=document.createElement('button');button.type='button';button.textContent=`${String.fromCharCode(65+index)}. ${option}`;button.addEventListener('click',()=>answerQuiz(index));$('quizOptions').append(button)})}
function answerQuiz(index){const quiz=quizBank[learningState.quizIndex%quizBank.length];const buttons=[...$('quizOptions').children];buttons.forEach((button,i)=>{button.disabled=true;if(i===quiz.answer)button.classList.add('correct');else if(i===index)button.classList.add('wrong')});if(index===quiz.answer){$('quizFeedback').textContent=`回答正确：${quiz.explain}`}else{$('quizFeedback').textContent=`正确答案是 ${String.fromCharCode(65+quiz.answer)}：${quiz.explain}`;if(!learningState.mistakes.some(item=>item.question===quiz.question))learningState.mistakes.unshift({question:quiz.question,answer:quiz.options[quiz.answer],explain:quiz.explain});persistLearning();renderMistakes()}}
function renderMistakes(){$('mistakeCount').textContent=`${learningState.mistakes.length} 道`;$('mistakeList').replaceChildren();if(!learningState.mistakes.length){const empty=document.createElement('div');empty.className='mistake-empty';empty.textContent='答错的题目会自动收进这里。';$('mistakeList').append(empty);return}learningState.mistakes.forEach(item=>{const card=document.createElement('article');card.className='mistake-item';const question=document.createElement('b');question.textContent=item.question;const answer=document.createElement('span');answer.textContent=`答案：${item.answer} · ${item.explain}`;card.append(question,answer);$('mistakeList').append(card)})}
function setupLearningExtras(){
  try{const saved=JSON.parse(localStorage.getItem('zlab-learning')||'{}');learningState={cards:Array.isArray(saved.cards)?saved.cards:[],mistakes:Array.isArray(saved.mistakes)?saved.mistakes:[],quizIndex:Number.isFinite(saved.quizIndex)?saved.quizIndex:Math.floor(Date.now()/86400000)%quizBank.length};const savedDeck=localStorage.getItem('zlab-flash-deck');flashDeck=['cet4','cet6','kaoyan','custom'].includes(savedDeck)?savedDeck:'cet6'}catch{learningState={cards:[],mistakes:[],quizIndex:0};flashDeck='cet6'}$('flashDeck').value=flashDeck;renderFlashcard();renderQuiz();renderMistakes();
  const flip=()=>$('flashcard').classList.toggle('flipped');$('flashcard').addEventListener('click',flip);$('flashcard').addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();flip()}});$('flashFlip').addEventListener('click',flip);
  $('flashDeck').addEventListener('change',event=>{flashDeck=['cet4','cet6','kaoyan','custom'].includes(event.target.value)?event.target.value:'cet6';flashcardIndex=0;try{localStorage.setItem('zlab-flash-deck',flashDeck)}catch{}renderFlashcard();loadVocabularyDeck(flashDeck)});
  $('flashPrev').addEventListener('click',()=>{if(activeFlashcards().length){flashcardIndex--;renderFlashcard()}});$('flashNext').addEventListener('click',()=>{if(activeFlashcards().length){flashcardIndex++;renderFlashcard()}});
  $('flashRandom').addEventListener('click',()=>{const cards=activeFlashcards();if(!cards.length)return;const current=flashcardIndex;do{flashcardIndex=Math.floor(Math.random()*cards.length)}while(cards.length>1&&flashcardIndex===current);renderFlashcard()});
  $('flashcardForm').addEventListener('submit',event=>{event.preventDefault();const front=value('flashWord'),back=value('flashMeaning');if(!front||!back){toast('请填写卡片正面和答案');return}learningState.cards.push({front,back});flashDeck='custom';$('flashDeck').value='custom';flashcardIndex=learningState.cards.length-1;$('flashWord').value='';$('flashMeaning').value='';try{localStorage.setItem('zlab-flash-deck','custom')}catch{}persistLearning();renderFlashcard();toast('已添加到“我的卡片”')});
  $('flashDelete').addEventListener('click',()=>{if(flashDeck!=='custom'||!learningState.cards.length)return;learningState.cards.splice(flashcardIndex,1);flashcardIndex=Math.max(0,flashcardIndex-1);persistLearning();renderFlashcard()});
  $('nextQuiz').addEventListener('click',()=>{learningState.quizIndex=(learningState.quizIndex+1)%quizBank.length;persistLearning();renderQuiz()});$('clearMistakes').addEventListener('click',()=>{if(!learningState.mistakes.length)return;if(confirm('确定清空错题本吗？')){learningState.mistakes=[];persistLearning();renderMistakes()}});
}

let activeGuideCategory='全部';
function guideLibrary(){return Array.isArray(window.YYSLS_GUIDES)?window.YYSLS_GUIDES:[]}
function renderGuides(){
  const guides=guideLibrary(),keyword=value('guideSearch').toLowerCase().normalize('NFKC');
  const filtered=guides.filter(guide=>{const text=`${guide.title} ${guide.summary} ${guide.category} ${(guide.tags||[]).join(' ')} ${(guide.sections||[]).map(section=>`${section.title} ${(section.points||[]).join(' ')}`).join(' ')}`.toLowerCase().normalize('NFKC');return (activeGuideCategory==='全部'||guide.category===activeGuideCategory)&&(!keyword||text.includes(keyword))});
  $('guideTotal').textContent=guides.length;$('guideResultTitle').textContent=activeGuideCategory==='全部'?'全部攻略':activeGuideCategory;$('guideResultCount').textContent=`${filtered.length} 篇`;
  document.querySelectorAll('[data-guide-category]').forEach(button=>button.classList.toggle('active',button.dataset.guideCategory===activeGuideCategory));
  const grid=$('guideGrid');grid.replaceChildren();filtered.forEach(guide=>{const card=document.createElement('article');card.className='guide-card';card.dataset.guideId=guide.id;card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',`打开攻略：${guide.title}`);card.innerHTML='<div class="guide-card-top"><span class="guide-card-icon"></span><div><small></small><b></b></div></div><h3></h3><p></p><div class="guide-card-tags"></div><footer><span></span><button type="button">阅读全文 →</button></footer>';card.querySelector('.guide-card-icon').textContent=guide.icon;card.querySelector('.guide-card-top small').textContent=guide.category;card.querySelector('.guide-card-top b').textContent=guide.version;card.querySelector('h3').textContent=guide.title;card.querySelector('p').textContent=guide.summary;const tags=card.querySelector('.guide-card-tags');guide.tags.forEach(tag=>{const chip=document.createElement('span');chip.textContent=tag;tags.append(chip)});card.querySelector('footer span').textContent=`来源：${guide.source}`;grid.append(card)});
  $('guideEmpty').hidden=filtered.length>0;grid.hidden=filtered.length===0;
}
function openGuide(id){
  const guide=guideLibrary().find(item=>item.id===id);if(!guide)return;const content=$('guideDialogContent');content.replaceChildren();
  const head=document.createElement('header');head.className='guide-detail-head';const label=document.createElement('span');label.textContent=`${guide.category} · ${guide.version}`;const title=document.createElement('h2');title.textContent=guide.title;const summary=document.createElement('p');summary.textContent=guide.summary;head.append(label,title,summary);content.append(head);
  guide.sections.forEach((section,index)=>{const block=document.createElement('section');block.className='guide-detail-section';const heading=document.createElement('h3');heading.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span>`;heading.append(document.createTextNode(section.title));const list=document.createElement('ul');section.points.forEach(point=>{const item=document.createElement('li');item.textContent=point;list.append(item)});block.append(heading,list);content.append(block)});
  const note=document.createElement('div');note.className='guide-version-note';note.textContent='版本提醒：攻略为公开资料的中文整理，游戏更新后部分机制与数值可能变化，请以当前游戏内说明为准。';const source=document.createElement('a');source.className='primary-button guide-source-button';source.href=guide.sourceUrl;source.target='_blank';source.rel='noopener';source.textContent=`可选：查看 GitHub 原始资料 · ${guide.source} ↗`;content.append(note,source);$('guideDialog').showModal();
}
function escapeGuideHtml(value){return String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]))}
function buildOfflineGuideHtml(guides=guideLibrary()){
  const h=escapeGuideHtml,generated=new Intl.DateTimeFormat('zh-CN',{dateStyle:'long'}).format(new Date());
  const articles=guides.map((guide,index)=>`<article><div class="meta"><span>${h(String(index+1).padStart(2,'0'))}</span><b>${h(guide.category)} · ${h(guide.version)}</b></div><h2>${h(guide.title)}</h2><p class="summary">${h(guide.summary)}</p>${(guide.sections||[]).map((section,sectionIndex)=>`<section><h3>${h(String(sectionIndex+1).padStart(2,'0'))} · ${h(section.title)}</h3><ul>${(section.points||[]).map(point=>`<li>${h(point)}</li>`).join('')}</ul></section>`).join('')}<p class="source">可选来源：<a href="${h(guide.sourceUrl)}">${h(guide.source)}</a></p></article>`).join('');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Z Lab · 燕云十六声离线攻略</title><style>:root{color-scheme:light;--ink:#193329;--green:#285f4c;--paper:#f3f1e8;--gold:#ad8241}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.8 system-ui,"Microsoft YaHei",sans-serif}header{padding:56px max(24px,calc((100% - 920px)/2));background:linear-gradient(135deg,#173c30,#326a54);color:#fff}header small{color:#efd99d;font-weight:800;letter-spacing:.12em}h1{margin:10px 0 12px;font:600 clamp(34px,7vw,62px)/1.2 Georgia,"Noto Serif SC",serif}header p{max-width:720px;margin:0;color:#cbdcd3}.offline{display:inline-block;margin-top:20px;padding:7px 11px;border:1px solid #789686;border-radius:99px;color:#dce9e2;font-size:13px}main{width:min(920px,calc(100% - 28px));margin:28px auto 60px}article{margin:14px 0;padding:30px clamp(20px,5vw,44px);border:1px solid #d8dfd9;border-radius:20px;background:#fff;box-shadow:0 12px 35px #2348370d}.meta{display:flex;align-items:center;gap:12px;color:#527064;font-size:13px}.meta span{display:grid;place-items:center;width:35px;height:35px;border-radius:10px;background:#e7eee9;color:var(--green);font-weight:900}h2{margin:15px 0 8px;font:600 28px/1.4 Georgia,"Noto Serif SC",serif}.summary{color:#65736c}article section{margin-top:24px;padding-top:18px;border-top:1px solid #e5e9e6}h3{margin:0;color:var(--green);font-size:17px}ul{padding-left:1.25em}li{margin:8px 0}.source{margin:25px 0 0;padding:11px 13px;border-left:3px solid var(--gold);background:#f7f2e8;color:#74654d;font-size:13px}.source a{color:var(--green)}footer{padding:26px;text-align:center;color:#7a857f;font-size:13px}@media print{header{padding:30px;color:#000;background:#fff}header p,.offline{color:#333}article{break-inside:avoid;box-shadow:none}}</style></head><body><header><small>Z LAB · OFFLINE GUIDE</small><h1>燕云十六声攻略集</h1><p>共 ${guides.length} 篇站内整理攻略。这个文件不依赖网络，保存后可直接双击打开；GitHub 链接仅用于可选的来源核对。</p><span class="offline">生成日期：${h(generated)} · 可离线阅读</span></header><main>${articles}</main><footer>Z Lab · 资料仅供个人学习参考 · 游戏内容以当前版本为准</footer></body></html>`;
}
function downloadOfflineGuides(){
  const guides=guideLibrary();if(!guides.length){toast('攻略数据还没有加载完成，请稍后再试');return}const blob=new Blob([buildOfflineGuideHtml(guides)],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='Z-Lab-燕云十六声离线攻略.html';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`已生成 ${guides.length} 篇离线攻略，下载后可断网阅读`);
}
function setupGuides(){
  const guides=guideLibrary(),categories=['全部',...new Set(guides.map(guide=>guide.category))];const wrap=$('guideCategories');wrap.replaceChildren();categories.forEach(category=>{const button=document.createElement('button');button.type='button';button.dataset.guideCategory=category;button.textContent=category;button.addEventListener('click',()=>{activeGuideCategory=category;renderGuides()});wrap.append(button)});
  $('guideSearch').addEventListener('input',renderGuides);$('downloadGuidesOffline').addEventListener('click',downloadOfflineGuides);$('guideGrid').addEventListener('click',event=>{const card=event.target.closest('[data-guide-id]');if(card)openGuide(card.dataset.guideId)});$('guideGrid').addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-guide-id]')){event.preventDefault();openGuide(event.target.dataset.guideId)}});$('guideReset').addEventListener('click',()=>{$('guideSearch').value='';activeGuideCategory='全部';renderGuides()});$('guideDialogClose').addEventListener('click',()=>$('guideDialog').close());$('guideDialog').addEventListener('click',event=>{if(event.target===$('guideDialog'))$('guideDialog').close()});renderGuides();
}

function registerOfflineCache(){if(!('serviceWorker' in navigator))return;navigator.serviceWorker.register('/sw.js?v=20260826-project23').catch(error=>console.warn('离线缓存注册失败',error))}

let board2048=[],score2048=0,game2048Touch=null,activePlayGame='2048';
function add2048Tile(){const empty=board2048.map((value,index)=>value?null:index).filter(index=>index!==null);if(!empty.length)return;const index=empty[Math.floor(Math.random()*empty.length)];board2048[index]=Math.random()<.9?2:4}
function render2048(){
  $('game2048').replaceChildren();board2048.forEach(number=>{const tile=document.createElement('div');tile.className='tile-2048';tile.dataset.value=number||0;tile.textContent=number||'';$('game2048').append(tile)});$('game2048Score').textContent=score2048;
}
function new2048Game(){board2048=Array(16).fill(0);score2048=0;add2048Tile();add2048Tile();render2048()}
function merge2048Line(line){const values=line.filter(Boolean);const result=[];for(let i=0;i<values.length;i++){if(values[i]===values[i+1]){const merged=values[i]*2;result.push(merged);score2048+=merged;i++}else result.push(values[i])}while(result.length<4)result.push(0);return result}
function move2048(direction){
  const before=board2048.join(',');const next=Array(16).fill(0);
  for(let outer=0;outer<4;outer++){let line=[];for(let inner=0;inner<4;inner++){const index=(direction==='left'||direction==='right')?outer*4+inner:inner*4+outer;line.push(board2048[index])}if(direction==='right'||direction==='down')line.reverse();line=merge2048Line(line);if(direction==='right'||direction==='down')line.reverse();for(let inner=0;inner<4;inner++){const index=(direction==='left'||direction==='right')?outer*4+inner:inner*4+outer;next[index]=line[inner]}}
  board2048=next;if(before!==board2048.join(',')){add2048Tile();render2048();if(board2048.includes(2048))toast('恭喜合成 2048！')}else if(!board2048.includes(0)&&!['left','right','up','down'].some(test=>canMove2048(test)))toast('本局结束，开始一局新的吧');
}
function canMove2048(direction){const copy=[...board2048];let possible=false;for(let outer=0;outer<4;outer++){let line=[];for(let inner=0;inner<4;inner++){const index=(direction==='left'||direction==='right')?outer*4+inner:inner*4+outer;line.push(copy[index])}const normalized=(direction==='right'||direction==='down')?[...line].reverse():line;const compact=normalized.filter(Boolean);if(compact.length<4||compact.some((value,index)=>value===compact[index+1]))possible=true}return possible}

let snakeBody=[],snakeDirection={x:1,y:0},snakeNextDirection={x:1,y:0},snakeFood={x:10,y:8},snakeTimer=null,snakeScore=0;
function placeSnakeFood(){do{snakeFood={x:Math.floor(Math.random()*16),y:Math.floor(Math.random()*16)}}while(snakeBody.some(part=>part.x===snakeFood.x&&part.y===snakeFood.y))}
function drawSnake(){const canvas=$('snakeCanvas');const context=canvas.getContext('2d');context.fillStyle='#18382c';context.fillRect(0,0,320,320);context.fillStyle='#e6a56d';context.beginPath();context.arc(snakeFood.x*20+10,snakeFood.y*20+10,7,0,Math.PI*2);context.fill();snakeBody.forEach((part,index)=>{context.fillStyle=index?'#79aa8d':'#d9eadf';context.fillRect(part.x*20+2,part.y*20+2,16,16)});$('snakeScore').textContent=snakeScore}
function setSnakeDirection(direction){const map={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};const next=map[direction];if(!next||next.x===-snakeDirection.x&&next.y===-snakeDirection.y)return;snakeNextDirection=next;activePlayGame='snake'}
function snakeStep(){snakeDirection=snakeNextDirection;const head={x:snakeBody[0].x+snakeDirection.x,y:snakeBody[0].y+snakeDirection.y};if(head.x<0||head.x>=16||head.y<0||head.y>=16||snakeBody.some(part=>part.x===head.x&&part.y===head.y)){clearInterval(snakeTimer);snakeTimer=null;$('startSnake').textContent='重新开始';toast(`游戏结束，得分 ${snakeScore}`);return}snakeBody.unshift(head);if(head.x===snakeFood.x&&head.y===snakeFood.y){snakeScore++;placeSnakeFood()}else snakeBody.pop();drawSnake()}
function startSnakeGame(){clearInterval(snakeTimer);snakeBody=[{x:7,y:8},{x:6,y:8},{x:5,y:8}];snakeDirection={x:1,y:0};snakeNextDirection={x:1,y:0};snakeScore=0;placeSnakeFood();drawSnake();activePlayGame='snake';snakeTimer=setInterval(snakeStep,125);$('startSnake').textContent='重新开始'}

let reactionState='idle',reactionTimeout=null,reactionStarted=0,reactionScores=[];
function renderReactionScores(){const best=reactionScores.length?Math.min(...reactionScores):null;$('reactionBest').textContent=best?`${best} ms`:'—';$('reactionHistory').textContent=reactionScores.length?`最近：${reactionScores.slice(-5).reverse().map(score=>`${score}ms`).join(' · ')}`:'还没有测试记录'}
function setupReaction(){
  try{reactionScores=JSON.parse(localStorage.getItem('zlab-reaction-scores')||'[]').filter(Number.isFinite).slice(-20)}catch{reactionScores=[]}renderReactionScores();
  $('reactionZone').addEventListener('click',()=>{const zone=$('reactionZone');if(reactionState==='waiting'){clearTimeout(reactionTimeout);reactionState='idle';zone.className='reaction-zone';zone.querySelector('b').textContent='太早了';zone.querySelector('span').textContent='还没有变绿，再点击一次重新开始';return}if(reactionState==='ready'){const score=Math.round(performance.now()-reactionStarted);reactionScores.push(score);reactionScores=reactionScores.slice(-20);try{localStorage.setItem('zlab-reaction-scores',JSON.stringify(reactionScores))}catch{}reactionState='idle';zone.className='reaction-zone';zone.querySelector('b').textContent=`${score} ms`;zone.querySelector('span').textContent='点击再测一次';renderReactionScores();return}reactionState='waiting';zone.className='reaction-zone waiting';zone.querySelector('b').textContent='等待绿色';zone.querySelector('span').textContent='现在先不要点击';reactionTimeout=setTimeout(()=>{reactionState='ready';reactionStarted=performance.now();zone.className='reaction-zone ready';zone.querySelector('b').textContent='现在点击！';zone.querySelector('span').textContent='越快越好'},1500+Math.random()*2500)});
}
function setupPlay(){
  new2048Game();drawSnake();setupReaction();$('new2048').addEventListener('click',()=>{activePlayGame='2048';new2048Game()});$('game2048').addEventListener('click',()=>activePlayGame='2048');$('startSnake').addEventListener('click',startSnakeGame);document.querySelectorAll('[data-snake-direction]').forEach(button=>button.addEventListener('click',()=>setSnakeDirection(button.dataset.snakeDirection)));
  $('game2048').addEventListener('touchstart',event=>{const touch=event.touches[0];game2048Touch={x:touch.clientX,y:touch.clientY}},{passive:true});$('game2048').addEventListener('touchend',event=>{if(!game2048Touch)return;const touch=event.changedTouches[0];const dx=touch.clientX-game2048Touch.x,dy=touch.clientY-game2048Touch.y;if(Math.max(Math.abs(dx),Math.abs(dy))>25)move2048(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');game2048Touch=null},{passive:true});
  document.addEventListener('keydown',event=>{if(!$('playView').classList.contains('active')||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;const directions={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};const direction=directions[event.key];if(!direction)return;event.preventDefault();if(activePlayGame==='snake')setSnakeDirection(direction);else move2048(direction)});
  setupMorePlay();
}

let ticBoard=Array(9).fill(''),ticLocked=false,ticScore={human:0,computer:0};
const ticWins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const ticWinner=board=>{for(const combo of ticWins){const [a,b,c]=combo;if(board[a]&&board[a]===board[b]&&board[a]===board[c])return board[a]}return board.every(Boolean)?'draw':''};
function renderTic(){
  $('ticBoard').replaceChildren();ticBoard.forEach((mark,index)=>{const button=document.createElement('button');button.type='button';button.className='tic-cell';button.textContent=mark;button.disabled=Boolean(mark)||ticLocked;button.addEventListener('click',()=>playTic(index));$('ticBoard').append(button)});$('ticScore').textContent=`你 ${ticScore.human} · 电脑 ${ticScore.computer}`;
}
function finishTic(winner){ticLocked=true;if(winner==='X'){ticScore.human++;$('ticStatus').textContent='你赢了！'}else if(winner==='O'){ticScore.computer++;$('ticStatus').textContent='电脑获胜'}else $('ticStatus').textContent='平局';try{localStorage.setItem('zlab-tic-score',JSON.stringify(ticScore))}catch{}renderTic()}
function chooseTicMove(){const open=ticBoard.map((value,index)=>value?null:index).filter(index=>index!==null);for(const mark of ['O','X'])for(const index of open){const test=[...ticBoard];test[index]=mark;if(ticWinner(test)===mark)return index}if(open.includes(4))return 4;const corners=open.filter(index=>[0,2,6,8].includes(index));return (corners.length?corners:open)[Math.floor(Math.random()*(corners.length?corners:open).length)]}
function playTic(index){if(ticLocked||ticBoard[index])return;ticBoard[index]='X';let winner=ticWinner(ticBoard);if(winner){finishTic(winner);return}ticLocked=true;$('ticStatus').textContent='电脑思考中';renderTic();setTimeout(()=>{const move=chooseTicMove();if(move!==undefined)ticBoard[move]='O';winner=ticWinner(ticBoard);ticLocked=false;if(winner)finishTic(winner);else{$('ticStatus').textContent='轮到你';renderTic()}},280)}
function newTic(){ticBoard=Array(9).fill('');ticLocked=false;$('ticStatus').textContent='轮到你';renderTic()}

let mineCells=[],mineGameOver=false,mineLongPress=null;
function newMine(){mineCells=Array.from({length:81},()=>({mine:false,revealed:false,flagged:false,count:0}));const indexes=[...Array(81).keys()].sort(()=>Math.random()-.5).slice(0,10);indexes.forEach(index=>mineCells[index].mine=true);mineCells.forEach((cell,index)=>{const x=index%9,y=Math.floor(index/9);cell.count=mineCells.filter((other,otherIndex)=>Math.abs(otherIndex%9-x)<=1&&Math.abs(Math.floor(otherIndex/9)-y)<=1&&other.mine).length});mineGameOver=false;$('mineStatus').textContent='10 个雷';renderMine()}
function revealMine(index){const cell=mineCells[index];if(!cell||cell.revealed||cell.flagged||mineGameOver)return;if(cell.mine){mineGameOver=true;mineCells.forEach(item=>{if(item.mine)item.revealed=true});$('mineStatus').textContent='踩到地雷了';renderMine();return}const queue=[index];while(queue.length){const current=queue.shift(),target=mineCells[current];if(!target||target.revealed||target.flagged)continue;target.revealed=true;if(target.count===0){const x=current%9,y=Math.floor(current/9);for(let yy=y-1;yy<=y+1;yy++)for(let xx=x-1;xx<=x+1;xx++){if(xx>=0&&xx<9&&yy>=0&&yy<9)queue.push(yy*9+xx)}}}if(mineCells.filter(item=>!item.mine).every(item=>item.revealed)){mineGameOver=true;$('mineStatus').textContent='扫雷成功！'}renderMine()}
function toggleMineFlag(index){const cell=mineCells[index];if(!cell||cell.revealed||mineGameOver)return;cell.flagged=!cell.flagged;$('mineStatus').textContent=`${mineCells.filter(item=>item.flagged).length} / 10 面旗`;renderMine()}
function renderMine(){$('mineBoard').replaceChildren();mineCells.forEach((cell,index)=>{const button=document.createElement('button');button.type='button';button.className=`mine-cell${cell.revealed?' revealed':''}${cell.flagged?' flagged':''}${cell.revealed&&cell.mine?' mine':''}`;button.textContent=cell.flagged?'⚑':cell.revealed?(cell.mine?'✹':cell.count||''):'';button.addEventListener('click',()=>revealMine(index));button.addEventListener('contextmenu',event=>{event.preventDefault();toggleMineFlag(index)});button.addEventListener('pointerdown',()=>mineLongPress=setTimeout(()=>toggleMineFlag(index),650));['pointerup','pointerleave','pointercancel'].forEach(type=>button.addEventListener(type,()=>clearTimeout(mineLongPress)));$('mineBoard').append(button)})}

const wordleWords=['APPLE','BRAIN','CHAIR','DREAM','EARTH','FOCUS','GRAPE','HOUSE','LIGHT','MUSIC','NURSE','OCEAN','PLANT','QUICK','RIVER','SMILE','TABLE','UNITY','WATER','YOUTH'];
let wordleState={date:'',guesses:[]};
const dailyWord=()=>wordleWords[Number(localDateKey().replace(/-/g,''))%wordleWords.length];
function wordleMarks(guess,answer){const marks=Array(5).fill('absent'),remaining={};for(let i=0;i<5;i++){if(guess[i]===answer[i])marks[i]='correct';else remaining[answer[i]]=(remaining[answer[i]]||0)+1}for(let i=0;i<5;i++)if(marks[i]!=='correct'&&remaining[guess[i]]){marks[i]='present';remaining[guess[i]]--}return marks}
function renderWordle(){const answer=dailyWord();$('wordleGrid').replaceChildren();for(let row=0;row<6;row++){const guess=wordleState.guesses[row]||'';const marks=guess?wordleMarks(guess,answer):[];for(let col=0;col<5;col++){const cell=document.createElement('div');cell.className=`wordle-cell${marks[col]?` ${marks[col]}`:''}`;cell.textContent=guess[col]||'';$('wordleGrid').append(cell)}}const solved=wordleState.guesses.includes(answer);$('wordleInput').disabled=solved||wordleState.guesses.length>=6;$('wordleMessage').textContent=solved?'猜对了！明天会有一个新单词。':wordleState.guesses.length>=6?`今日答案：${answer}`:'绿色位置正确，黄色字母存在但位置不对。'}
function submitWordle(event){event.preventDefault();const guess=value('wordleInput').toUpperCase();if(!/^[A-Z]{5}$/.test(guess)){toast('请输入 5 个英文字母');return}if(wordleState.guesses.length>=6||wordleState.guesses.includes(dailyWord()))return;wordleState.guesses.push(guess);$('wordleInput').value='';try{localStorage.setItem('zlab-wordle',JSON.stringify(wordleState))}catch{}renderWordle()}

let memoryCards=[],memoryOpen=[],memoryLocked=false,memoryMoves=0;
function newMemory(){const symbols=['☀','☁','★','◆','♣','♫','✿','⚡'];memoryCards=[...symbols,...symbols].sort(()=>Math.random()-.5).map((symbol,index)=>({id:index,symbol,matched:false}));memoryOpen=[];memoryLocked=false;memoryMoves=0;renderMemory()}
function renderMemory(){$('memoryBoard').replaceChildren();memoryCards.forEach((card,index)=>{const button=document.createElement('button');button.type='button';button.className=`memory-card${memoryOpen.includes(index)?' flipped':''}${card.matched?' matched':''}`;button.textContent=card.symbol;button.disabled=card.matched||memoryLocked;button.addEventListener('click',()=>flipMemory(index));$('memoryBoard').append(button)});$('memoryMoves').textContent=`${memoryMoves} 步`;$('memoryStatus').textContent=memoryCards.every(card=>card.matched)?'全部配对完成！':'找到全部 8 对'}
function flipMemory(index){if(memoryLocked||memoryOpen.includes(index)||memoryCards[index].matched)return;memoryOpen.push(index);renderMemory();if(memoryOpen.length===2){memoryMoves++;const [a,b]=memoryOpen;if(memoryCards[a].symbol===memoryCards[b].symbol){memoryCards[a].matched=memoryCards[b].matched=true;memoryOpen=[];renderMemory()}else{memoryLocked=true;setTimeout(()=>{memoryOpen=[];memoryLocked=false;renderMemory()},700)}}}

const funFacts=['章鱼有三颗心脏，其中两颗负责把血液送往鳃。','蜂蜜在密封且保存得当的情况下可以存放非常久。','金星上的一天比它的一年还长。','人类大脑在安静休息时依然会消耗大量能量。','香蕉从植物分类上属于浆果，而草莓并不是真正的浆果。','海豚会用独特的口哨声互相“称呼名字”。','世界上第一台计算机鼠标是用木头制作的。','猫的鼻纹像人的指纹一样具有独特性。','水在结冰时体积会膨胀，因此冰能浮在水面。','一只蜗牛可以睡上很长时间来度过不利环境。'];
const fortuneCards=[{icon:'☀',title:'适合开始',text:'先完成一件最小的事情，今天会比想象中顺利。'},{icon:'✦',title:'适合学习',text:'今天容易进入专注状态，试试 25 分钟不被打断。'},{icon:'☕',title:'适合放慢',text:'给自己留一点空白，休息也是计划的一部分。'},{icon:'↗',title:'适合尝试',text:'换一种方法处理旧问题，可能会得到新的答案。'},{icon:'♫',title:'适合整理',text:'整理桌面、文件或思绪，会让接下来的行动更轻松。'},{icon:'❤',title:'适合联系',text:'给很久没联系的人发条消息，也许会收到惊喜。'}];
function drawTodayFortune(){const card=fortuneCards[Number(localDateKey().replace(/-/g,''))%fortuneCards.length];$('fortuneIcon').textContent=card.icon;$('fortuneTitle').textContent=card.title;$('fortuneText').textContent=card.text;try{localStorage.setItem('zlab-fortune-date',localDateKey())}catch{}}
function setupMorePlay(){
  try{const saved=JSON.parse(localStorage.getItem('zlab-tic-score')||'{}');ticScore={human:Number(saved.human)||0,computer:Number(saved.computer)||0}}catch{}newTic();$('newTicGame').addEventListener('click',newTic);
  newMine();$('newMineGame').addEventListener('click',newMine);
  const date=localDateKey();try{const saved=JSON.parse(localStorage.getItem('zlab-wordle')||'{}');wordleState=saved.date===date&&Array.isArray(saved.guesses)?saved:{date,guesses:[]}}catch{wordleState={date,guesses:[]}}$('wordleDay').textContent=date.slice(5);renderWordle();$('wordleForm').addEventListener('submit',submitWordle);
  newMemory();$('newMemoryGame').addEventListener('click',newMemory);
  const nextFact=()=>{$('funFact').textContent=funFacts[Math.floor(Math.random()*funFacts.length)]};$('nextFunFact').addEventListener('click',nextFact);nextFact();$('drawFortune').addEventListener('click',drawTodayFortune);drawTodayFortune();
}

const wheelColors=['#285f4c','#d8a871','#779e8a','#b77965','#6c7f9c','#c4a45d','#9b7a96','#527f88','#bf8b62','#789a65','#8c7568','#4e6a58'];
let wheelRotation=0,wheelSpinning=false,wheelTimer=null;
function wheelChoices(){return value('wheelOptions').split(/\n/).map(item=>item.trim()).filter(Boolean).slice(0,12)}
function renderWheel(){
  const choices=wheelChoices(),wheel=$('choiceWheel'),legend=$('wheelLegend');legend.replaceChildren();
  if(!choices.length){wheel.style.background='#e1e7e2';$('wheelResult').textContent='请添加选项';return}
  const step=360/choices.length;wheel.style.background=`conic-gradient(${choices.map((_,index)=>`${wheelColors[index]} ${index*step}deg ${(index+1)*step}deg`).join(',')})`;wheel.title=choices.map((choice,index)=>`${index+1}. ${choice}`).join('\n');
  choices.forEach((choice,index)=>{const item=document.createElement('span');item.dataset.wheelIndex=index;const dot=document.createElement('i');dot.style.background=wheelColors[index];const text=document.createElement('b');text.textContent=choice;item.append(dot,text);legend.append(item)});
  wheelRotation=0;wheel.style.transform='rotate(0deg)';$('wheelResult').textContent='等待选择';
}
function wheelLandingRotation(current,selected,count){const step=360/count,currentAngle=((current%360)+360)%360,targetAngle=(360-(selected+.5)*step)%360,adjustment=(targetAngle-currentAngle+360)%360;return current+1440+adjustment}
function spinChoiceWheel(){
  const choices=wheelChoices();if(choices.length<2){toast('请至少输入两个选项');return}if(wheelSpinning)return;
  const selected=safeRandomInt(0,choices.length-1);wheelRotation=wheelLandingRotation(wheelRotation,selected,choices.length);wheelSpinning=true;$('spinWheel').disabled=true;$('wheelOptions').disabled=true;$('wheelResult').textContent='转动中…';document.querySelectorAll('#wheelLegend [data-wheel-index]').forEach(item=>item.classList.remove('selected'));$('choiceWheel').style.transform=`rotate(${wheelRotation}deg)`;
  clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{wheelSpinning=false;$('spinWheel').disabled=false;$('wheelOptions').disabled=false;$('wheelResult').textContent=`结果：${choices[selected]}`;document.querySelector(`#wheelLegend [data-wheel-index="${selected}"]`)?.classList.add('selected')},1280);
}
function renderCountdown(){const name=value('countdownName')||'目标日期';const raw=$('countdownDate').value;if(!raw){$('countdownResult').innerHTML='<span>设置一个目标日期</span><b>—</b><small>日</small>';return}const target=new Date(`${raw}T00:00:00`);const diff=target.getTime()-Date.now();const days=Math.max(0,Math.ceil(diff/86400000));$('countdownResult').innerHTML='';const label=document.createElement('span');label.textContent=diff>=0?`${name}还有`:`${name}已经到来`;const number=document.createElement('b');number.textContent=days;const unit=document.createElement('small');unit.textContent='日';$('countdownResult').append(label,number,unit)}
function setupEverydayTools(){
  renderWheel();$('wheelOptions').addEventListener('input',renderWheel);$('spinWheel').addEventListener('click',spinChoiceWheel);
  $('generateQr').addEventListener('click',()=>{const text=value('qrInput');if(!text){toast('请先输入文字或网址');return}if(typeof QRCode==='undefined'){toast('二维码组件加载失败，请刷新页面');return}$('qrOutput').replaceChildren();new QRCode($('qrOutput'),{text,width:180,height:180,colorDark:'#173c2e',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H})});
  $('downloadQr').addEventListener('click',()=>{const canvas=$('qrOutput').querySelector('canvas');const image=$('qrOutput').querySelector('img');const source=canvas?.toDataURL('image/png')||image?.src;if(!source){toast('请先生成二维码');return}const link=document.createElement('a');link.href=source;link.download='zlab-qrcode.png';link.click()});
  const today=localDateKey();$('countdownDate').min=today;try{const saved=JSON.parse(localStorage.getItem('zlab-countdown')||'null');if(saved){$('countdownName').value=saved.name||'';$('countdownDate').value=saved.date||''}}catch{}renderCountdown();$('saveCountdown').addEventListener('click',()=>{if(!$('countdownDate').value){toast('请先选择目标日期');return}try{localStorage.setItem('zlab-countdown',JSON.stringify({name:value('countdownName'),date:$('countdownDate').value}))}catch{}renderCountdown();toast('倒计时已保存')});setInterval(renderCountdown,60000);
}

let lifeState={note:'',bookmarks:[],todos:[],expenses:[],markdown:''},selectedImageFile=null,processedImageUrl='';
function persistLife(){try{localStorage.setItem('zlab-life',JSON.stringify(lifeState))}catch{}}
function renderLife(){
  $('bookmarkCount').textContent=`${lifeState.bookmarks.length} 个`;$('bookmarkList').replaceChildren();if(!lifeState.bookmarks.length){const empty=document.createElement('div');empty.className='empty-mini';empty.textContent='添加常用网站后，可以从这里一键打开。';$('bookmarkList').append(empty)}lifeState.bookmarks.forEach(item=>{const row=document.createElement('div');row.className='bookmark-item';const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener';link.textContent=item.name;const small=document.createElement('small');small.textContent=item.url;link.append(small);const remove=document.createElement('button');remove.type='button';remove.dataset.removeBookmark=item.id;remove.textContent='×';row.append(link,remove);$('bookmarkList').append(row)});
  const done=lifeState.todos.filter(item=>item.done).length;$('lifeTodoProgress').textContent=`${done} / ${lifeState.todos.length}`;$('lifeTodoList').replaceChildren();if(!lifeState.todos.length){const empty=document.createElement('div');empty.className='empty-mini';empty.textContent='还没有生活待办。';$('lifeTodoList').append(empty)}lifeState.todos.forEach(item=>{const row=document.createElement('label');row.className=`life-todo-item${item.done?' done':''}`;row.dataset.lifeTodo=item.id;const check=document.createElement('input');check.type='checkbox';check.checked=item.done;const text=document.createElement('span');text.textContent=item.text;const remove=document.createElement('button');remove.type='button';remove.dataset.removeLifeTodo=item.id;remove.textContent='×';row.append(check,text,remove);$('lifeTodoList').append(row)});
  const total=lifeState.expenses.reduce((sum,item)=>sum+Number(item.amount),0);$('expenseTotal').textContent=`¥${total.toFixed(2)}`;$('expenseList').replaceChildren();if(!lifeState.expenses.length){const empty=document.createElement('div');empty.className='empty-mini';empty.textContent='还没有记账记录。';$('expenseList').append(empty)}lifeState.expenses.forEach(item=>{const row=document.createElement('div');row.className='expense-item';const info=document.createElement('span');info.textContent=`${item.category}${item.note?` · ${item.note}`:''}`;const date=document.createElement('small');date.textContent=item.date;info.append(date);const amount=document.createElement('b');amount.textContent=`¥${Number(item.amount).toFixed(2)}`;const remove=document.createElement('button');remove.type='button';remove.dataset.removeExpense=item.id;remove.textContent='×';row.append(info,amount,remove);$('expenseList').append(row)});
}
const safeRandomInt=(min,max)=>{const range=max-min+1;if(range<=0)return min;const random=new Uint32Array(1),limit=0x100000000-(0x100000000%range);do{crypto.getRandomValues(random)}while(random[0]>=limit);return min+random[0]%range};
function escapeHtml(text){return String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function markdownToHtml(markdown){
  const codeBlocks=[];let safe=escapeHtml(markdown).replace(/```([\s\S]*?)```/g,(_,code)=>`%%CODE${codeBlocks.push(code)-1}%%`);const inline=text=>text.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  safe=safe.split('\n').map(line=>{if(/^%%CODE\d+%%$/.test(line))return line;if(/^### /.test(line))return `<h3>${inline(line.slice(4))}</h3>`;if(/^## /.test(line))return `<h2>${inline(line.slice(3))}</h2>`;if(/^# /.test(line))return `<h1>${inline(line.slice(2))}</h1>`;if(/^> /.test(line))return `<blockquote>${inline(line.slice(2))}</blockquote>`;if(/^[-*] /.test(line))return `<ul><li>${inline(line.slice(2))}</li></ul>`;return line?`<p>${inline(line)}</p>`:'<br>'}).join('');return safe.replace(/%%CODE(\d+)%%/g,(_,index)=>`<pre><code>${codeBlocks[Number(index)]}</code></pre>`);
}
function hslToHex(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return `#${[f(0),f(8),f(4)].map(value=>Math.round(255*value).toString(16).padStart(2,'0')).join('')}`}
function generatePalette(){const hue=safeRandomInt(0,359);const colors=[hslToHex((hue+300)%360,40,35),hslToHex((hue+335)%360,48,52),hslToHex(hue,55,65),hslToHex((hue+28)%360,60,76),hslToHex((hue+65)%360,38,88)];$('paletteRow').replaceChildren();colors.forEach(color=>{const button=document.createElement('button');button.type='button';button.className='palette-swatch';button.style.background=color;button.textContent=color.toUpperCase();button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(color.toUpperCase())}catch{}$('paletteStatus').textContent=`已复制 ${color.toUpperCase()}`});$('paletteRow').append(button)})}
function setupLife(){
  try{const saved=JSON.parse(localStorage.getItem('zlab-life')||'{}');lifeState={note:saved.note||'',bookmarks:Array.isArray(saved.bookmarks)?saved.bookmarks:[],todos:Array.isArray(saved.todos)?saved.todos:[],expenses:Array.isArray(saved.expenses)?saved.expenses:[],markdown:saved.markdown||''}}catch{}$('lifeNote').value=lifeState.note;$('markdownInput').value=lifeState.markdown;renderLife();$('markdownPreview').innerHTML=markdownToHtml(lifeState.markdown)||'<p>预览会显示在这里。</p>';
  let noteTimer;$('lifeNote').addEventListener('input',()=>{lifeState.note=$('lifeNote').value;$('lifeNoteStatus').textContent='正在保存…';clearTimeout(noteTimer);noteTimer=setTimeout(()=>{persistLife();$('lifeNoteStatus').textContent='已自动保存'},350)});
  $('bookmarkForm').addEventListener('submit',event=>{event.preventDefault();const name=value('bookmarkName'),url=value('bookmarkUrl');if(!name||!/^https?:\/\//i.test(url)){toast('请填写名称和完整网址');return}lifeState.bookmarks.unshift({id:String(Date.now()),name,url});$('bookmarkName').value='';$('bookmarkUrl').value='';persistLife();renderLife()});$('bookmarkList').addEventListener('click',event=>{const button=event.target.closest('[data-remove-bookmark]');if(!button)return;lifeState.bookmarks=lifeState.bookmarks.filter(item=>item.id!==button.dataset.removeBookmark);persistLife();renderLife()});
  $('lifeTodoForm').addEventListener('submit',event=>{event.preventDefault();const text=value('lifeTodoInput');if(!text)return;lifeState.todos.unshift({id:String(Date.now()),text,done:false});$('lifeTodoInput').value='';persistLife();renderLife()});$('lifeTodoList').addEventListener('change',event=>{const row=event.target.closest('[data-life-todo]');const item=lifeState.todos.find(todo=>todo.id===row?.dataset.lifeTodo);if(item){item.done=event.target.checked;persistLife();renderLife()}});$('lifeTodoList').addEventListener('click',event=>{const button=event.target.closest('[data-remove-life-todo]');if(!button)return;lifeState.todos=lifeState.todos.filter(item=>item.id!==button.dataset.removeLifeTodo);persistLife();renderLife()});
  $('expenseForm').addEventListener('submit',event=>{event.preventDefault();const amount=Number($('expenseAmount').value);if(!Number.isFinite(amount)||amount<=0){toast('请输入正确金额');return}lifeState.expenses.unshift({id:String(Date.now()),amount,category:$('expenseCategory').value,note:value('expenseNote'),date:localDateKey()});$('expenseAmount').value='';$('expenseNote').value='';persistLife();renderLife()});$('expenseList').addEventListener('click',event=>{const button=event.target.closest('[data-remove-expense]');if(!button)return;lifeState.expenses=lifeState.expenses.filter(item=>item.id!==button.dataset.removeExpense);persistLife();renderLife()});
  $('flipCoin').addEventListener('click',()=>{$('randomResult').textContent=safeRandomInt(0,1)?'正面':'反面'});$('rollDice').addEventListener('click',()=>{$('randomResult').textContent=`骰子：${safeRandomInt(1,6)}`});$('generateRandomNumber').addEventListener('click',()=>{let min=Math.ceil(Number($('randomMin').value)),max=Math.floor(Number($('randomMax').value));if(!Number.isFinite(min)||!Number.isFinite(max)||min>max){toast('请检查随机数范围');return}$('randomResult').textContent=String(safeRandomInt(min,max))});
  $('imageInput').addEventListener('change',()=>{selectedImageFile=$('imageInput').files[0]||null;if(selectedImageFile){$('imageInfo').textContent=`已选择：${selectedImageFile.name} · ${(selectedImageFile.size/1024).toFixed(0)} KB`;$('imagePreview').hidden=true;$('downloadImage').disabled=true}});$('imageQuality').addEventListener('input',event=>$('imageQualityLabel').textContent=`${event.target.value}%`);
  $('processImage').addEventListener('click',()=>{if(!selectedImageFile){toast('请先选择图片');return}const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const maxWidth=Math.max(200,Number($('imageMaxWidth').value)||1200),scale=Math.min(1,maxWidth/image.width),canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);processedImageUrl=canvas.toDataURL('image/webp',Number($('imageQuality').value)/100);$('imagePreview').src=processedImageUrl;$('imagePreview').hidden=false;$('downloadImage').disabled=false;const estimated=Math.round((processedImageUrl.length-processedImageUrl.indexOf(','))*0.75/1024);$('imageInfo').textContent=`${canvas.width} × ${canvas.height} · 约 ${estimated} KB`} ;image.src=reader.result};reader.readAsDataURL(selectedImageFile)});$('downloadImage').addEventListener('click',()=>{if(!processedImageUrl)return;const link=document.createElement('a');link.href=processedImageUrl;link.download='zlab-image.webp';link.click()});
  generatePalette();$('generatePalette').addEventListener('click',generatePalette);
  let markdownTimer;$('markdownInput').addEventListener('input',()=>{lifeState.markdown=$('markdownInput').value;$('markdownPreview').innerHTML=markdownToHtml(lifeState.markdown)||'<p>预览会显示在这里。</p>';clearTimeout(markdownTimer);markdownTimer=setTimeout(persistLife,350)});$('copyMarkdown').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('markdownInput').value);toast('Markdown 原文已复制')}catch{toast('复制失败，请手动复制')}});
}

function switchView(view){
  const careerViews=['resume','jobs','tracker'];
  if(view!=='play'&&snakeTimer){clearInterval(snakeTimer);snakeTimer=null;$('startSnake').textContent='开始游戏'}
  document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===`${view}View`));
  document.querySelectorAll('.nav-button').forEach(el=>el.classList.toggle('active',el.dataset.view===view));
  document.querySelectorAll('[data-mobile-view]').forEach(el=>el.classList.toggle('active',el.dataset.mobileView===view));
  $('careerSubnav').hidden=!careerViews.includes(view);document.querySelectorAll('[data-career-view]').forEach(button=>button.classList.toggle('active',button.dataset.careerView===view));
  history.replaceState(null,'',`#${view}`);if(view==='study')loadVocabularyDeck(flashDeck);if(view==='guides')renderGuides();if(view==='jobs'){renderJobs();loadJobsForView().then(()=>{if($('jobsView').classList.contains('active'))renderJobs(false)})}if(view==='tracker')renderTracker(); window.scrollTo({top:0,behavior:'smooth'});
}

function openTool(anchor){
  switchView('tools');
  if(anchor)setTimeout(()=>$(anchor)?.scrollIntoView({behavior:'smooth',block:'start'}),120);
}

function handleExtraEntryClick(event){
  const add=event.target.closest('[data-add-entry]');
  if(add){
    const kind=add.dataset.addEntry;const entries=collectExtraEntries()[kind]||[];
    if(entries.length>=20){toast('同一栏目最多添加 20 条经历');return}
    entries.push({});const all=collectExtraEntries();all[kind]=entries;setExtraEntries(all);renderResume();saveResume();
    const newest=$(extraEntryConfig[kind].container).lastElementChild;newest?.querySelector('input,textarea')?.focus();toast('已添加一条空白经历');return;
  }
  const remove=event.target.closest('[data-remove-entry]');
  if(remove&&confirm('确定删除这段经历吗？')){
    const kind=remove.dataset.removeEntry;const entries=collectExtraEntries()[kind]||[];entries.splice(Number(remove.dataset.entryIndex),1);
    const all=collectExtraEntries();all[kind]=entries;setExtraEntries(all);renderResume();saveResume();toast('这段经历已删除');
  }
}

document.addEventListener('DOMContentLoaded',async()=>{
  jobCachePromise=restoreCachedJobs();
  loadResume();loadProductState();populateJobFilters();renderJobs();renderTracker();setupToolbox();setupEverydayTools();setupStudy();setupGuides();setupPlay();setupLife();registerVisit();registerOfflineCache();
  $('resumeForm').addEventListener('input',()=>{renderResume();scheduleSave()});
  $('resumeForm').addEventListener('click',handleExtraEntryClick);
  $('sampleButton').addEventListener('click',()=>{fillForm(sampleResume);toast('示例内容已填入，可继续修改')});
  $('clearButton').addEventListener('click',()=>{if(confirm('确定清空当前简历内容吗？')){fillForm({});toast('简历内容已清空')}});
  document.querySelectorAll('.template-option').forEach(button=>button.addEventListener('click',()=>setTemplate(button.dataset.template,true)));
  $('accentColor').addEventListener('input',event=>setAccent(event.target.value));
  $('backupButton').addEventListener('click',saveBackup);
  $('saveVersionButton').addEventListener('click',saveManualVersion);
  $('resumeVersionSelect').addEventListener('change',event=>openResumeVersion(event.target.value));
  $('importButton').addEventListener('click',()=>{$('parsePreview').hidden=true;$('importDialog').showModal()});
  $('importClose').addEventListener('click',()=>$('importDialog').close());
  $('importDialog').addEventListener('click',event=>{if(event.target===$('importDialog'))$('importDialog').close()});
  $('pasteSample').addEventListener('click',()=>{$('resumeRawText').value='姓名：陈晓雨\n求职意向：数据分析师\n电话：138 0000 0000\n邮箱：chen@example.com\n所在城市：杭州\n个人优势：擅长从数据中发现业务问题，能够独立完成数据清洗、分析和可视化。\n核心技能：Python, SQL, Excel, Tableau\n\n工作经历\n远望科技有限公司\n数据分析实习生\n2025.06 — 2025.12\n• 搭建销售数据看板，将周报制作时间缩短 60%\n• 分析 12 万条用户行为数据，推动转化率提升 8%\n\n教育经历\n浙江理工大学\n统计学 · 本科\n2023.09 — 2027.06\nGPA：3.8 / 专业前 10%';toast('示例已填入，可直接生成')});
  $('generateResume').addEventListener('click',async()=>{try{const file=$('resumeImport').files[0];const raw=value('resumeRawText');if(file)await importSource(await extractFile(file));else if(raw)await importSource({kind:'text',value:raw});else toast('请先选择文件或粘贴个人资料')}catch(error){toast(error.message||'资料识别失败')}});
  $('resumeImport').addEventListener('change',()=>{const file=$('resumeImport').files[0];if(file){$('resumeDropZone').querySelector('b').textContent=file.name;$('resumeDropZone').querySelector('small').textContent=`${(file.size/1024).toFixed(0)} KB · 点击“识别并生成简历”`}});
  ['dragenter','dragover'].forEach(type=>$('resumeDropZone').addEventListener(type,event=>{event.preventDefault();$('resumeDropZone').classList.add('dragging')}));
  ['dragleave','drop'].forEach(type=>$('resumeDropZone').addEventListener(type,event=>{event.preventDefault();$('resumeDropZone').classList.remove('dragging')}));
  $('resumeDropZone').addEventListener('drop',event=>{const file=event.dataTransfer.files[0];if(file){const transfer=new DataTransfer();transfer.items.add(file);$('resumeImport').files=transfer.files;$('resumeImport').dispatchEvent(new Event('change'))}});
  $('printButton').addEventListener('click',()=>window.print());
  $('overviewButton').addEventListener('click',()=>$('functionDialog').showModal());
  $('functionDialogClose').addEventListener('click',()=>$('functionDialog').close());
  $('functionDialog').addEventListener('click',event=>{if(event.target===$('functionDialog'))$('functionDialog').close()});
  document.querySelectorAll('[data-overview-view]').forEach(button=>button.addEventListener('click',()=>{const view=button.dataset.overviewView;$('functionDialog').close();if(view==='tools'&&button.dataset.toolAnchor)openTool(button.dataset.toolAnchor);else switchView(view)}));
  document.querySelectorAll('.tool-index [data-tool-anchor]').forEach(button=>button.addEventListener('click',()=>openTool(button.dataset.toolAnchor)));
  document.querySelectorAll('.nav-button').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.view)));
  document.querySelectorAll('[data-mobile-view]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.mobileView)));
  document.querySelectorAll('[data-career-view]').forEach(button=>button.addEventListener('click',()=>switchView(button.dataset.careerView)));
  document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();switchView('home')});
  $('jobSearchForm').addEventListener('submit',async event=>{event.preventDefault();if(!jobDataLoaded){$('resultSummary').textContent='正在载入完整岗位库，完成后自动搜索…';toast('岗位库正在加载，完成后会自动搜索');await loadJobsForView()}renderJobs();toast(`找到 ${activeJobs.length} 个匹配岗位`)});
  $('provinceFilter').addEventListener('change',()=>{populateCityFilter();renderJobs()});
  ['cityFilter','companyTypeFilter','batchFilter','audienceFilter','sortFilter'].forEach(id=>$(id).addEventListener('change',()=>renderJobs()));
  $('jobGrid').addEventListener('click',event=>{const save=event.target.closest('[data-save-job]');if(save){const job=jobs.find(item=>String(item.id)===String(save.dataset.saveJob));if(job)toggleTrackedJob(job);return}const button=event.target.closest('[data-job-id]');if(button)openJob(button.dataset.jobId)});
  $('dialogClose').addEventListener('click',()=>$('jobDialog').close());
  $('jobDialog').addEventListener('click',event=>{if(event.target===$('jobDialog'))$('jobDialog').close()});
  $('applicationDone').addEventListener('click',()=>resolveApplication(true));
  $('applicationNotDone').addEventListener('click',()=>resolveApplication(false));
  $('applicationConfirmClose').addEventListener('click',()=>resolveApplication(false));
  $('applicationConfirm').addEventListener('click',event=>{if(event.target===$('applicationConfirm'))resolveApplication(false)});
  window.addEventListener('focus',checkPendingApplication);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkPendingApplication()});
  $('loadMore').addEventListener('click',()=>{visibleLimit+=60;renderJobs(false)});
  $('resetFilters').addEventListener('click',()=>{$('jobKeyword').value='';$('provinceFilter').value='all';populateCityFilter();$('cityFilter').value='all';$('companyTypeFilter').value='all';$('batchFilter').value='all';$('audienceFilter').value='all';renderJobs()});
  $('trackerSearch').addEventListener('input',renderTracker);
  $('exportTracker').addEventListener('click',exportTracker);
  $('trackerBoard').addEventListener('change',event=>{const card=event.target.closest('[data-track-id]');if(card&&event.target.matches('.tracker-status'))updateTrackedEntry(card.dataset.trackId,{status:event.target.value})});
  $('trackerBoard').addEventListener('input',event=>{const card=event.target.closest('[data-track-id]');if(card&&event.target.matches('.tracker-note')){clearTimeout(event.target.timer);event.target.timer=setTimeout(()=>updateTrackedEntry(card.dataset.trackId,{note:event.target.value},false),350)}});
  $('trackerBoard').addEventListener('click',event=>{const card=event.target.closest('[data-track-id]');if(!card)return;const entry=trackedJob(card.dataset.trackId);if(event.target.closest('.open-track')){const live=jobs.find(job=>String(job.id)===String(entry.id));if(live)openJob(live.id);else window.open(entry.applicationUrl,'_blank','noopener')}if(event.target.closest('.remove-track')&&confirm('从投递看板移除这个岗位吗？')){trackerEntries=trackerEntries.filter(item=>item.id!==entry.id);persistTracker();renderTracker();renderJobs(false)}});
  document.querySelectorAll('[data-go-view]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.goView==='tools'&&button.dataset.toolAnchor)openTool(button.dataset.toolAnchor);else switchView(button.dataset.goView)}));
  setInterval(async()=>{if(!jobDataLoaded&&!$('jobsView').classList.contains('active'))return;await loadOnlineJobs(true);renderJobs(false)},2*60*60*1000);
  const requested=location.hash.slice(1);if(['home','study','play','guides','life','tools','resume','jobs','tracker','about'].includes(requested))switchView(requested);else switchView('home');
  const preload=()=>jobCachePromise.then(()=>loadOnlineJobs(false));if('requestIdleCallback'in window)requestIdleCallback(preload,{timeout:2500});else setTimeout(preload,1200);
  setTimeout(checkPendingApplication,1200);
});
