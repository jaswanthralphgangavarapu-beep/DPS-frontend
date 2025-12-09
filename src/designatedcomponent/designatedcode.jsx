import { useState, useEffect, useRef } from "react"
import "../designatedcomponent/designateddesign.css"
import videodripco from "../assets/videodripco.mp4"
import videodripcomobile from "../assets/videodripcomobile.mp4"

const Designated = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <div className={`designated-video-section ${isVisible ? "visible" : ""}`} ref={sectionRef}>
      <video className="background-video" autoPlay loop muted playsInline>
        <source
          src={isMobile ? videodripcomobile : videodripco}
          type="video/mp4"
        />
      </video>

      <div className="video-overlay"></div>

      <div className="video-content">
        <h1 className="typing-title">
          {/* You can add static text here if needed */}
          The DripCo.store
        </h1>
      </div>
    </div>
  )
}

export default Designated;
