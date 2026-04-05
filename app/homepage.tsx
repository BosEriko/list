"use client";
import Atom from "@atom";
import Organism from "@organism";
import useAuthStore from "@store/useAuthStore";

const Homepage = () => {
  const { user } = useAuthStore();
  return (
    <div>
      <Atom.Visibility state={user !== null}>
        <Organism.Feed />
      </Atom.Visibility>
      <Atom.Visibility state={user === null}>
        <Organism.Recommend />
      </Atom.Visibility>
    </div>
  );
}

export default Homepage;
