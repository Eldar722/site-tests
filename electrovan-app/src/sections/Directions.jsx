import DirCard from "../components/DirectionsCard";

function Directions() {
  return (
    <section className="directions" id="directions">
      <div className='container'>
        <div className='directions-title text-heading-xl'>
          Где удобно использовать?
        </div>
        <DirCard />
      </div>
    </section>
  )
}

export default Directions;