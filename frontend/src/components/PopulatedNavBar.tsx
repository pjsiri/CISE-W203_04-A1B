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
            <NavItem route="/articles/CreateArticle">Submit Article</NavItem>
            <NavItem route="/search">Search</NavItem>
            {session?.user?.role === 'analyst' && (
              <NavItem route="/analyst">Analyst</NavItem>
            )}
            {session?.user?.role === 'moderator' && (
              <NavItem route="/moderator">Moderator</NavItem>
            )}
            {session?.user?.role === 'admin' && (
              <NavItem dropdown route="/admin">Admin <IoMdArrowDropdown />
                <NavDropdown>
                    <NavItem route="/admin">Manage articles</NavItem>
                    <NavItem route="/admin/manageEmails">Manage roles</NavItem>
                </NavDropdown>
              </NavItem>
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