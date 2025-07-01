import { useRoutePaths, useSession } from "@/hooks";
import { Logo } from "../NavBar";
import TopBar from "./TopBar";
import { Footer, Navigation, PageHeading } from ".";

type Props = {
    children: React.ReactNode
}
  
export default function ApplicationLayout(props: Props) {
const { user } = useSession();
const { ROOT_PATH } = useRoutePaths()
const {children} = props
return (
    <>
    <div className="page">
        <TopBar>Test</TopBar>
        {/* <Navigation>sdsd</Navigation> */}

      <div className="page-wrapper">
        {/* <!-- Page body --> */}
        {children}
        <Footer>sd</Footer>
      </div>
    </div>
    </>
)
}  