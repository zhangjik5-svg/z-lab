const skills = ['用户研究', '数据分析', '项目管理', '增长策略'];

export default function Home() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="职达首页">
          <span className="brand-mark">Z</span>
          <span>职达</span>
          <small>CAREER STUDIO</small>
        </a>
        <nav aria-label="主要导航">
          <a className="active" href="#resume">简历工作台</a>
          <a href="#jobs">岗位雷达</a>
          <a href="#progress">投递看板</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="通知">●</button>
          <button className="avatar" aria-label="个人中心">你</button>
        </div>
      </header>

      <section className="workspace-head">
        <div>
          <p className="eyebrow">今天也在靠近理想工作</p>
          <h1>把每一次投递，变成一次精准表达。</h1>
        </div>
        <div className="score-card" aria-label="简历完成度 82%">
          <div className="score-ring"><strong>82</strong><span>分</span></div>
          <div><b>简历状态良好</b><small>再补充 2 项，竞争力更完整</small></div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="resume-panel" id="resume">
          <div className="panel-toolbar">
            <div>
              <span className="status-dot" />
              <b>产品经理 · 通用版</b>
              <small>刚刚自动保存</small>
            </div>
            <div className="toolbar-actions">
              <button className="ghost-button">模板</button>
              <button className="primary-button">导出 PDF</button>
            </div>
          </div>

          <div className="resume-canvas">
            <aside className="resume-nav" aria-label="简历模块">
              <button className="selected"><span>01</span>基本信息</button>
              <button><span>02</span>个人优势</button>
              <button><span>03</span>工作经历</button>
              <button><span>04</span>项目经历</button>
              <button><span>05</span>教育经历</button>
              <button><span>06</span>技能证书</button>
              <button className="add-section">＋ 添加模块</button>
            </aside>

            <div className="resume-paper">
              <div className="resume-name-row">
                <div>
                  <span className="resume-role">PRODUCT MANAGER</span>
                  <h2>你的姓名</h2>
                  <p>产品经理 · 3 年经验 · 上海</p>
                </div>
                <div className="photo-placeholder">上传<br />照片</div>
              </div>
              <div className="contact-line">
                <span>138 **** 0000</span><i />
                <span>hello@example.com</span><i />
                <span>求职状态：在职看机会</span>
              </div>
              <section className="resume-section">
                <div className="section-title"><span>01</span><h3>个人优势</h3><button>编辑</button></div>
                <p>擅长从用户洞察中定义问题，以数据驱动产品迭代。主导过 0→1 产品建设与跨团队协作，关注业务结果，也在意体验细节。</p>
                <div className="skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </section>
              <section className="resume-section">
                <div className="section-title"><span>02</span><h3>工作经历</h3><button>编辑</button></div>
                <div className="experience-row"><div><b>某科技有限公司</b><p>产品经理</p></div><time>2023.07 — 至今</time></div>
                <ul>
                  <li>负责核心业务流程重构，推动需求分析、方案设计与上线复盘全流程。</li>
                  <li>通过数据看板定位转化瓶颈，关键路径转化率提升 18%。</li>
                </ul>
              </section>
            </div>
          </div>
        </article>

        <aside className="job-panel" id="jobs">
          <div className="job-heading"><div><p className="eyebrow">JOB RADAR</p><h2>岗位雷达</h2></div><span>12 个新机会</span></div>
          <div className="search-box">
            <span>⌕</span>
            <input aria-label="搜索岗位" defaultValue="产品经理" />
            <button>搜索</button>
          </div>
          <div className="filter-row"><button>上海⌄</button><button>3-5年⌄</button><button>20-35K⌄</button></div>
          <div className="match-card featured">
            <div className="job-top"><div className="company-logo purple">M</div><div><h3>高级产品经理</h3><p>星河科技 · 上海</p></div><strong>28-35K</strong></div>
            <div className="match-score"><span>92% 匹配</span><small>技能与经历高度契合</small></div>
            <div className="job-tags"><span>B端产品</span><span>数据驱动</span><span>五险一金</span></div>
            <button className="view-job">查看岗位详情 <span>→</span></button>
          </div>
          <div className="match-card">
            <div className="job-top"><div className="company-logo orange">A</div><div><h3>产品经理</h3><p>安云网络 · 杭州</p></div><strong>22-30K</strong></div>
            <div className="job-tags"><span>SaaS</span><span>双休</span><span>年终奖</span></div>
          </div>
          <button className="all-jobs">查看全部匹配岗位 <span>→</span></button>
        </aside>
      </section>
    </main>
  );
}
