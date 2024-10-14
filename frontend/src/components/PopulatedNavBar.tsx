import { IoMdArrowDropdown } from "react-icons/io";
import NavBar from "./nav/NavBar";
import NavDropdown from "./nav/NavDropdown";
import NavItem from "./nav/NavItem";
import { useSession, signIn, signOut } from "next-auth/react";

// Extend the Session type to include the role property
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
    };
  }
}

const PopulatedNavBar = () => {

  const { data: session } = useSession();

    return (
        <NavBar>
            <NavItem>SPEED</NavItem>
            <NavItem route="/" end>
                Home
            </NavItem>
            <NavItem dropdown route="/articles">
                Articles <IoMdArrowDropdown />
                <NavDropdown>
                    <NavItem route="/articles">View articles</NavItem>
                    <NavItem route="/articles/CreateArticle">Submit article</NavItem>
                </NavDropdown>
            </NavItem>
            <NavItem route="/search">Search</NavItem>
            {session?.user?.role === 'analyst' && (
              <NavItem route="/analyst">Analyst</NavItem>
            )}
            {session?.user?.role === 'moderator' && (
              <NavItem route="/moderator">Moderator</NavItem>
            )}
            {session ? (
              <NavItem onClick={() => signOut()}>Sign Out</NavItem>
            ) : (
              <NavItem onClick={() => signIn()}>Sign In</NavItem>
            )}
        </NavBar>
    );
};

export default PopulatedNavBar;