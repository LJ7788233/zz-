import { useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { PROJECTS } from "./projects.js";
import "./ProjectDetail.css";
import { useEffect } from "react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const location = useLocation();
  const project = PROJECTS.find((item) => item.id === projectId);
  const [isHotspotVideoOpen, setIsHotspotVideoOpen] = useState(false);
  const backState =
    Number.isFinite(location.state?.fromScrollY)
      ? { restoreScrollY: location.state.fromScrollY }
      : { scrollTo: "project" };

  useEffect(() => {
    if (!isHotspotVideoOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isHotspotVideoOpen]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  if (project.isFullPageImage) {
    const overlay = project.overlayVideo;
    const hotspot = project.hotspotVideo;
    const overlayStyle = overlay
      ? {
          "--ov-left": `${(overlay.x / overlay.baseWidth) * 100}%`,
          "--ov-top": `${(overlay.y / overlay.baseHeight) * 100}%`,
          "--ov-width": `${(overlay.width / overlay.baseWidth) * 100}%`,
          "--ov-height": `${(overlay.height / overlay.baseHeight) * 100}%`,
        }
      : undefined;

    return (
      <main className="project-detail-page project-detail-page--full-image">
        {!project.hideBack && (
          <Link className="project-back project-back-icon" to="/" state={backState} aria-label="返回首页">
            <span aria-hidden="true">✕</span>
          </Link>
        )}
        <section className="project-full-image-wrap" style={overlayStyle}>
          <img src={project.cover} alt={`${project.title || project.subtitle}页面`} loading="eager" decoding="async" />
          {hotspot && (
            <button
              type="button"
              className="project-full-image-hotspot"
              aria-label="播放智慧场站视频"
              style={{
                left: `${(hotspot.x / hotspot.baseWidth) * 100}%`,
                top: `${(hotspot.y / hotspot.baseHeight) * 100}%`,
                width: `${(hotspot.width / hotspot.baseWidth) * 100}%`,
                height: `${(hotspot.height / hotspot.baseHeight) * 100}%`,
              }}
              onClick={() => setIsHotspotVideoOpen(true)}
            />
          )}
          {overlay && (
            <video
              className="project-full-image-overlay-video"
              src={overlay.src}
              controls
              playsInline
              preload="metadata"
            />
          )}
        </section>
        {hotspot && isHotspotVideoOpen && (
          <div className="project-hotspot-video-modal" role="dialog" aria-modal="true" aria-label="智慧场站视频">
            <button
              type="button"
              className="project-hotspot-video-backdrop"
              aria-label="关闭视频"
              onClick={() => setIsHotspotVideoOpen(false)}
            />
            <div className="project-hotspot-video-panel">
              <button
                type="button"
                className="project-hotspot-video-close"
                aria-label="关闭视频"
                onClick={() => setIsHotspotVideoOpen(false)}
              >
                关闭
              </button>
              <video src={hotspot.src} controls autoPlay playsInline preload="metadata" />
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="project-detail-page">
      <Link className="project-back project-back-icon" to="/" state={backState} aria-label="返回首页">
        <span aria-hidden="true">✕</span>
      </Link>
      <section className={`project-detail-card ${project.video ? "project-detail-card--video" : ""}`}>
        {!project.video && <p className="project-detail-index">{project.index}</p>}
        <h1>{project.title}</h1>
        {!project.video && project.subtitle && (
          <p className="project-detail-subtitle">{project.subtitle}</p>
        )}
        {project.video && <p className="project-detail-summary">{project.summary}</p>}
        {project.video ? (
          <video
            src={project.video}
            controls
            playsInline
            preload="metadata"
            className="project-detail-video"
          />
        ) : (
          <img src={project.cover} alt={`${project.title}封面图`} loading="eager" decoding="async" />
        )}
        {!project.video && <p className="project-detail-summary">{project.summary}</p>}
      </section>
    </main>
  );
}
