import Header from "../components/Header";
import Footer from "../components/Footer";
import { ButtonLink } from "../components/Button";
import Assets from "../components/Assets.jsx";

export default function Home() {
  return (
    <main id="home">
      <Header />
      <section className="flex hero">
        <section className="flex flex-col justifyCenter alignStart">
          <h2>Say Goodbye to Car Repair Hassles</h2>

          <p>
            For over a century, dating back to 1892, we have been steadfast in
            providing exceptional service. Our commitment to delivering the
            finest quality service has been instrumental in establishing a
            strong reputation. We are determined to continue building on this
            legacy with your support.
          </p>

          {ButtonLink({
            domain: "/reservation",
            text: "Make Reservation",
            classNames: "button",
          })}
        </section>

        <div className="imageContainer">
          <img src={Assets.whiteCar} alt="white car" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
