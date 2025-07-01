import { useRoutePaths, useSession } from "@/hooks";
import { Logo } from "../NavBar";

type Props = {
    children: React.ReactNode
}
  
export default function TopBar(props: Props) {
const { user } = useSession();
const { ROOT_PATH } = useRoutePaths()
const {children} = props
return (
    <>
        <footer className="footer footer-transparent d-print-none">
          <div className="container-xl">
            <div className="row text-center align-items-center flex-row-reverse">
              <div className="col-lg-auto ms-lg-auto">
                <ul className="list-inline list-inline-dots mb-0">
                  {/* <li className="list-inline-item"><a href="https://tabler.io/docs" target="_blank" className="link-secondary" rel="noopener">Documentation</a></li> */}
                </ul>
              </div>
              <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                <ul className="list-inline list-inline-dots mb-0">
                  <li className="list-inline-item">
                    Copyright &copy; 2023
                    <a href="." className="link-secondary">POW</a>. 
                    All rights reserved.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
    </>
)}