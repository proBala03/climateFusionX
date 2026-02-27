import { Sun } from "./Sun";
import { Cloud } from "./Cloud";
import { Rain } from "./Rain";

export function WeatherBackground() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 mask-image-fade">
            {/* 
        This wrapper is absolute block positioned behind the 
        landing page content. z-0 ensures it does not block interactions.
        The pointer-events-none ensures clicks pass through to the buttons.
      */}

            {/* Rain layer */}
            <Rain count={35} />

            {/* Sun positioned at top right */}
            <Sun className="top-[10%] right-[15%] w-24 h-24 md:w-40 md:h-40" />

            {/* Drifting Clouds with different durations and delays for a natural look */}
            <Cloud className="top-[5%] w-32 h-32 md:w-56 md:h-56" duration={45} delay={0} />
            <Cloud className="top-[18%] w-24 h-24 md:w-40 md:h-40" duration={55} delay={15} />
            <Cloud className="top-[35%] w-20 h-20 md:w-32 md:h-32" duration={35} delay={5} />
            <Cloud className="top-[12%] w-16 h-16 md:w-28 md:h-28" duration={60} delay={25} />
            <Cloud className="top-[25%] w-40 h-40 md:w-64 md:h-64" duration={70} delay={30} />
        </div>
    );
}
