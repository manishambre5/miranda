import FeatureSpotlight from "./components/FeatureSpotlight"
import Notebooks from "./components/Notebooks"

const HomePage = () => {
  return (
    <div className="px-2">
        <Notebooks />
        <FeatureSpotlight />
    </div>
  )
}

export default HomePage