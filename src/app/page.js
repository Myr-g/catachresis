import StoryList from "@/components/StoryList"
import "./css/home.css"

export default function Home() {
  return (
    <div className="content">
      <div className="home">
        <section className="home-header">
          <h1>Catachresis</h1>
          <p>A simple app made with the intention of helping people improve, or just indulge, in creative writing.</p>
        </section>

        <StoryList/>
      </div>
    </div>
  );
}
