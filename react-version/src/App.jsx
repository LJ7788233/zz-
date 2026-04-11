import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Orb from "./components/Orb.jsx";
import Aurora from "./components/Aurora.jsx";

const BG_IMG = "/assets/bg.png";
const DESIGN_IMG = "/assets/design.svg";
const PORTFOLIO_IMG = "/assets/portfolio.svg";
const YEAR_IMG = "/assets/year.svg";
const DECO_1 = "/assets/deco-1.svg";
const DECO_2 = "/assets/deco-2.svg";
const DECO_3 = "/assets/deco-3.svg";
const INTRO_GLOW_IMG = "/assets/intro-glow.png";
const INTRO_AVATAR_IMG = "/assets/intro-avatar.png";
const INTRO_DOT_IMG = "/assets/intro-dot.svg";
const OVERVIEW_BG_GLOW = "/assets/overview-bg-glow.png";
const OVERVIEW_IMG_01 = "/assets/overview-01.webp";
const OVERVIEW_IMG_02 = "/assets/overview-02.webp";
const OVERVIEW_IMG_03 = "/assets/overview-03.webp";
const OVERVIEW_IMG_04 = "/assets/overview-04.webp";
const END_THANKYOU_IMG = "/assets/end-thankyou.svg";
const END_SHAPE_1 = "/assets/end-shape-1.svg";
const END_SHAPE_2 = "/assets/end-shape-2.svg";
const END_SHAPE_3 = "/assets/end-shape-3.svg";
const END_FOR_WATCH_BADGE_IMG = "/for-watch-badge.svg";
const ABOUT_IMG_01 = "/11.png";
const ABOUT_IMG_02 = "/assets/about-02.jpg";
const ABOUT_IMG_03 = "/assets/about-03.jpg";
const ABOUT_IMG_04 = "/assets/about-04.jpg";
const ABOUT_IMG_05 = "/assets/about-05.jpg";
const ABOUT_IMG_06 = "/assets/about-06.jpg";
const ABOUT_IMG_07 = "/assets/about-07.jpg";
const HERO_HEIGHT = 1080;
const INTRO_HEIGHT = 1080;
const OVERVIEW_HEIGHT = 2898;
/** 移动端项目概览纵向排版时的设计稿高度（与 App.css .s3-mobile 一致） */
const MOBILE_OVERVIEW_HEIGHT = 5200;
const PROFILE_HEIGHT = 1080;
const END_HEIGHT = 1080;
const NAV_ITEMS = [
  { id: "cover", label: "作品封面" },
  { id: "intro", label: "个人介绍" },
  { id: "project", label: "设计项目" },
  { id: "lab", label: "AI实验室" },
  { id: "contact", label: "联系方式" },
];

function computeLiteGraphics() {
  if (typeof window === "undefined") return false;
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mem = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const lowMem = mem != null && mem <= 4;
  const lowCpu = cores != null && cores <= 4;
  return narrow || reduced || lowMem || lowCpu;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const keepOverviewStableOnReturn = Number.isFinite(location.state?.restoreScrollY);
  const openProject = (path) => {
    navigate(path, { state: { fromScrollY: window.scrollY } });
  };
  const [activeNav, setActiveNav] = useState(0);
  const [fixedPreview, setFixedPreview] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const [heroInView, setHeroInView] = useState(true);
  const [endInView, setEndInView] = useState(false);
  const [introMounted, setIntroMounted] = useState(false);
  const [profileMounted, setProfileMounted] = useState(false);
  const [endMounted, setEndMounted] = useState(false);
  const [introRevealed, setIntroRevealed] = useState(false);
  const [overviewRevealed, setOverviewRevealed] = useState(keepOverviewStableOnReturn);
  const [profileRevealed, setProfileRevealed] = useState(false);
  const [endRevealed, setEndRevealed] = useState(false);
  const [liteGraphics, setLiteGraphics] = useState(computeLiteGraphics);
  const [mobileOverviewLayout, setMobileOverviewLayout] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const overviewRef = useRef(null);
  const profileRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navEntry = performance.getEntriesByType("navigation")[0];
    const isHardReload = navEntry?.type === "reload";

    const hasReturnState =
      Number.isFinite(location.state?.restoreScrollY) || Boolean(location.state?.scrollTo);

    if (isHardReload && !hasReturnState) {
      // Hard reload should always land on cover.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
      return;
    }

    const restoreScrollY = location.state?.restoreScrollY;
    const targetByState = location.state?.scrollTo;
    const targetByHash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
    const targetId = targetByState || targetByHash;

    requestAnimationFrame(() => {
      if (Number.isFinite(restoreScrollY)) {
        window.scrollTo({ top: restoreScrollY, left: 0, behavior: "auto" });
        return;
      }
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [location.state]);

  useEffect(() => {
    const updateScale = () => {
      const next = Math.min(window.innerWidth / 1920, 1);
      setStageScale(next);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setLiteGraphics(computeLiteGraphics());
      setMobileOverviewLayout(mqNarrow.matches);
    };
    sync();
    mqNarrow.addEventListener("change", sync);
    mqReduce.addEventListener("change", sync);
    return () => {
      mqNarrow.removeEventListener("change", sync);
      mqReduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const target = heroRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setHeroInView(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = endRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setEndInView(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = introRef.current;
    if (!target || introMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIntroMounted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "300px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [introMounted]);

  useEffect(() => {
    const target = profileRef.current;
    if (!target || profileMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setProfileMounted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "300px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [profileMounted]);

  useEffect(() => {
    const target = endRef.current;
    if (!target || endMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setEndMounted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "300px 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [endMounted]);

  useEffect(() => {
    const target = introRef.current;
    if (!target || !introMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIntroRevealed(entry.isIntersecting);
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [introMounted]);

  useEffect(() => {
    const target = overviewRef.current;
    if (!target || keepOverviewStableOnReturn) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setOverviewRevealed(entry.isIntersecting);
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [keepOverviewStableOnReturn]);

  useEffect(() => {
    const target = profileRef.current;
    if (!target || !profileMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setProfileRevealed(entry.isIntersecting);
      },
      {
        threshold: 0.01,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [profileMounted]);

  useEffect(() => {
    const target = endRef.current;
    if (!target || endRevealed || !endMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setEndRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [endRevealed, endMounted]);

  useEffect(() => {
    if (liteGraphics) return undefined;
    const idle = window.requestIdleCallback ?? ((cb) => window.setTimeout(cb, 1200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;

    const task = idle(() => {
      [
        INTRO_GLOW_IMG,
        INTRO_AVATAR_IMG,
        INTRO_DOT_IMG,
        OVERVIEW_BG_GLOW,
        OVERVIEW_IMG_01,
        OVERVIEW_IMG_02,
        OVERVIEW_IMG_03,
        OVERVIEW_IMG_04,
        ABOUT_IMG_01,
        ABOUT_IMG_02,
        ABOUT_IMG_03,
        ABOUT_IMG_04,
        ABOUT_IMG_05,
        ABOUT_IMG_06,
        ABOUT_IMG_07,
        END_THANKYOU_IMG,
        END_SHAPE_1,
        END_SHAPE_2,
        END_SHAPE_3,
      ].forEach((src) => {
        const img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        img.src = src;
      });
    });

    return () => cancelIdle(task);
  }, [liteGraphics]);

  const effectiveScale = fixedPreview ? 1 : stageScale;
  const overviewBlockHeight = mobileOverviewLayout ? MOBILE_OVERVIEW_HEIGHT : OVERVIEW_HEIGHT;
  const stageHeight =
    (HERO_HEIGHT + INTRO_HEIGHT + overviewBlockHeight + PROFILE_HEIGHT + END_HEIGHT) * effectiveScale;

  return (
    <div className={`page-wrap ${fixedPreview ? "is-fixed-preview" : ""}`}>
      <button
        type="button"
        className="preview-toggle"
        onClick={() => setFixedPreview((prev) => !prev)}
      >
        1:1预览 {fixedPreview ? "开" : "关"}
      </button>

      <div className="stage-host" style={{ height: `${stageHeight}px` }}>
        <div
          className="portfolio-stage"
          style={{ transform: `translateX(-50%) scale(${effectiveScale})` }}
        >
          <section ref={heroRef} className="hero-frame" aria-label="作品封面">
            <img className="hero-bg" src={BG_IMG} alt="" />
            <div className="hero-half-orb" aria-hidden="true">
              {liteGraphics ? (
                <div className="hero-half-orb-fallback" />
              ) : (
                <Orb
                  hoverIntensity={0.2}
                  rotateOnHover
                  hue={0}
                  forceHoverState={false}
                  backgroundColor="#040711"
                  active={heroInView}
                />
              )}
            </div>

            <div className="hero-title-group">
              <img className="hero-design" src={DESIGN_IMG} alt="DESIGN" />
              <img className="hero-portfolio" src={PORTFOLIO_IMG} alt="PORTFOLIO" />
              <div className="hero-year-wrap">
                <img className="hero-year" src={YEAR_IMG} alt="2026" />
              </div>
            </div>

            <div className="hero-badge" aria-hidden="true">
              <div className="hero-badge-rot">
                <div className="hero-badge-shell">
                  <div className="hero-badge-core" />
                </div>
                <span>UI/UX</span>
              </div>
            </div>

            <button type="button" className="hero-deco d1" aria-label="装饰1">
              <img src={DECO_1} alt="" />
            </button>
            <button type="button" className="hero-deco d2" aria-label="装饰2">
              <img src={DECO_2} alt="" />
            </button>
            <button type="button" className="hero-deco d3" aria-label="装饰3">
              <img src={DECO_3} alt="" />
            </button>

            <div className="hero-top-mask" aria-hidden="true" />

            <header
              className="header-nav"
              style={{ "--active-index": activeNav }}
            >
              <span className="nav-indicator" aria-hidden="true" />
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={index === activeNav ? "is-active" : ""}
                  onClick={() => setActiveNav(index)}
                >
                  {item.label}
                </a>
              ))}
            </header>
          </section>

          <section
            ref={introRef}
            className={`intro-frame s2 ${introRevealed ? "is-revealed" : ""}`}
            id="intro"
            aria-label="个人介绍"
          >
            {introMounted && (
              <>
                <img className="s2-glow" src={INTRO_GLOW_IMG} alt="" loading="lazy" decoding="async" />

                <div className="s2-title s2-anim a1">
                  <h2>个人介绍</h2>
                  <p>PERSONAL INTRODUCTION</p>
                </div>

                <div className="s2-panel">
                  <article className="s2-avatar-card s2-anim a2">
                    <img className="s2-avatar" src={INTRO_AVATAR_IMG} alt="刘婕照片" loading="lazy" decoding="async" />
                    <div className="s2-avatar-mask" />
                  </article>

                  <div className="s2-head s2-anim a3">
                    <div className="s2-name">刘婕</div>
                    <p className="s2-tl">5年设计经验</p>
                    <p className="s2-tr">福州大学-211本科</p>
                    <p className="s2-bl"><span>手机号</span>14760026599</p>
                    <p className="s2-br"><span>邮箱</span>mynhan30122007@gmail.com</p>
                  </div>

                  <article className="s2-exp s2-exp1 s2-anim a4">
                    <p className="s2-date">2021.11-2025.08</p>
                    <img className="s2-dot" src={INTRO_DOT_IMG} alt="" loading="lazy" decoding="async" />
                    <h3 className="s2-company">金卡智能集团 <small>（智能燃气行业龙头）</small></h3>
                    <p className="s2-role">资深体验设计师</p>
                    <div className="s2-body">
                      <p>2023 软件中心年度优秀个人奖  连续 3 年绩效评定为 A</p>
                      <p>从0到1负责 杭州市能源集团（一、二期）大屏 能源隐患管控系统 WEB 小程序 杭州电信智算中心等多个G端项目  从需求到落地全流程 获得客户高度认可，并成功推动了后续增值业务的达成</p>
                      <p>主导展会、招标、展厅类视频设计全链路工作，涵盖设计策略制定、交互原型搭建、视觉执行方案落地，助力团队斩获多项 G 端订单</p>
                      <p>主导团队 AI 设计技能培训工作，系统分享设计实战心得、高效工具与前沿资讯，推动团队 AI 设计应用能力落地提效</p>
                      <p>与团队共同建设维护组件库，助使研发高效落地项目缩短开发周期</p>
                    </div>
                  </article>

                  <article className="s2-exp s2-exp2 s2-anim a5">
                    <p className="s2-date">2020.06-2021.03</p>
                    <img className="s2-dot" src={INTRO_DOT_IMG} alt="" loading="lazy" decoding="async" />
                    <h3 className="s2-company">361度中国有限公司</h3>
                    <p className="s2-role">产品设计助理</p>
                    <div className="s2-body">
                      <p>负责流行趋势调研分析 整合 归纳 协助电商团队制定产品规划策略并输出当季设计企划案（流行趋势 主题 色彩 图案 面料 款式）主导21Q2女子系列 雨屏 等核心产品研发 品最高订货量突破 26.4w 双</p>
                      <p>负责核心鞋款的设计开发全流程，对接生产工厂把控工艺细节与视觉还原度，优化版型贴合度与生产可行性，保障设计方案高效落地</p>
                    </div>
                  </article>
                </div>
              </>
            )}
          </section>

          <section
            ref={overviewRef}
            className={`overview-frame s3 ${overviewRevealed ? "is-revealed" : ""} ${
              keepOverviewStableOnReturn ? "no-enter-animation" : ""
            } ${mobileOverviewLayout ? "s3-mobile" : ""}`}
            id="project"
            aria-label="项目概览"
          >
            <>
              <img className="s3-bg-glow" src={OVERVIEW_BG_GLOW} alt="" loading="lazy" decoding="async" />

                <div className="s3-title s3-anim a1">
                  <h2>项目概览</h2>
                  <p>PROJECT OVERVIEW</p>
                </div>

                <div className="s3-row r1 s3-anim a2">
                  <article className="s3-card text" role="button" tabIndex={0} onClick={() => openProject("/project/enterprise")}>
                    <p className="idx">01</p>
                    <h3>B端设计</h3>
                    <span>客户信息系统</span>
                  </article>
                  <article className="s3-card media" role="button" tabIndex={0} onClick={() => openProject("/project/enterprise")}>
                    <img src={OVERVIEW_IMG_01} alt="B端设计项目图" loading="lazy" decoding="async" />
                  </article>
                </div>

                <div className="s3-row r2 s3-anim a3">
                  <article className="s3-card media" role="button" tabIndex={0} onClick={() => openProject("/project/mobile-ai")}>
                    <img src={OVERVIEW_IMG_02} alt="AI安检助手项目图" loading="lazy" decoding="async" />
                  </article>
                  <article className="s3-card text" role="button" tabIndex={0} onClick={() => openProject("/project/mobile-ai")}>
                    <p className="idx">02</p>
                    <h3>移动端</h3>
                    <span>AI安检助手</span>
                  </article>
                </div>

                <div className="s3-row r3 s3-anim a4">
                  <article className="s3-card text" role="button" tabIndex={0} onClick={() => openProject("/project/dataviz-brain")}>
                    <p className="idx">03</p>
                    <h3>数据可视化</h3>
                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); openProject("/project/dataviz-brain"); }} onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); openProject("/project/dataviz-brain"); } }}>能源数字大脑</span>
                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); openProject("/project/smart-gate"); }} onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); openProject("/project/smart-gate"); } }}>智慧门站</span>
                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); openProject("/project/iot-hall"); }} onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); openProject("/project/iot-hall"); } }}>IOT展厅</span>
                  </article>
                  <article className="s3-card media" role="button" tabIndex={0} onClick={() => openProject("/project/dataviz-brain")}>
                    <img src={OVERVIEW_IMG_03} alt="数据可视化项目图" loading="lazy" decoding="async" />
                  </article>
                </div>

                <div className="s3-row r4 s3-anim a5">
                  <article className="s3-card media" role="button" tabIndex={0} onClick={() => openProject("/project/ops-visual")}>
                    <img src={OVERVIEW_IMG_04} alt="AI实验室项目图" loading="lazy" decoding="async" />
                  </article>
                  <article className="s3-card text" role="button" tabIndex={0} onClick={() => openProject("/project/ops-visual")}>
                    <p className="idx">04</p>
                    <h3>AI实验室</h3>
                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); openProject("/project/ops-visual"); }} onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); openProject("/project/ops-visual"); } }}>运营视觉类</span>
                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); openProject("/project/digital-human"); }} onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); openProject("/project/digital-human"); } }}>数字人</span>
                  </article>
                </div>
            </>
          </section>

          <section
            ref={profileRef}
            className={`profile-frame s5 ${profileRevealed ? "is-revealed" : ""}`}
            id="lab"
            aria-label="补充个人介绍"
          >
            {profileMounted && (
              <div className="s5-inner">
                <div className="s5-head s5-anim a1">
                  <h2>关于我</h2>
                  <p>SELF-INTRODUCTION</p>
                </div>
                <div className="s5-gallery">
                  <article className="s5-photo card-1 s5-anim a2"><img src={ABOUT_IMG_01} alt="" loading="lazy" decoding="async" /></article>
                  <article className="s5-photo card-2 s5-anim a3"><img src={ABOUT_IMG_02} alt="" loading="lazy" decoding="async" /></article>
                  <article className="s5-photo card-3 s5-anim a4"><img src={ABOUT_IMG_03} alt="" loading="lazy" decoding="async" /></article>
                  <article className="s5-photo card-4 s5-anim a5"><img src={ABOUT_IMG_04} alt="" loading="lazy" decoding="async" /></article>
                  <article className="s5-photo card-5 s5-anim a6"><img src={ABOUT_IMG_05} alt="" loading="lazy" decoding="async" /></article>
                  <article className="s5-photo card-6 s5-anim a7"><img src={ABOUT_IMG_06} alt="" loading="lazy" decoding="async" /></article>
                  <article className="s5-photo card-7 s5-anim a8"><img src={ABOUT_IMG_07} alt="" loading="lazy" decoding="async" /></article>
                </div>
              </div>
            )}
          </section>

          <section
            ref={endRef}
            className={`end-frame s4 ${endRevealed ? "is-revealed" : ""}`}
            id="contact"
            aria-label="结束页"
          >
            {endMounted && (
              <>
                <div className="s4-bg" />
                <div className="s4-aurora" aria-hidden="true">
                  {liteGraphics ? (
                    <div className="s4-aurora-fallback" />
                  ) : (
                    <Aurora
                      colorStops={["#1afbff", "#7075ff", "#2930ff"]}
                      blend={0.5}
                      amplitude={1.0}
                      speed={0.8}
                      active={endInView}
                    />
                  )}
                </div>

                <div className="s4-thankyou s4-anim a1">
                  <img src={END_THANKYOU_IMG} alt="THANK YOU" loading="lazy" decoding="async" />
                </div>

                <div className="s4-badge s4-anim a2" aria-hidden="true">
                  <img
                    className="s4-badge-img"
                    src={END_FOR_WATCH_BADGE_IMG}
                    alt=""
                    width="271"
                    height="170"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <img className="s4-shape s4-shape-1" src={END_SHAPE_1} alt="" loading="lazy" decoding="async" />
                <img className="s4-shape s4-shape-2" src={END_SHAPE_2} alt="" loading="lazy" decoding="async" />
                <img className="s4-shape s4-shape-3" src={END_SHAPE_3} alt="" loading="lazy" decoding="async" />

                <div className="s4-footer s4-anim a6">
                  <span>ZZ Design Lab</span>
                  <span>2026</span>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
