import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { removeToken, readToken } from "@/lib/authenticate";

export default function MainNav() {
  const [search, setSearch] = useState("");
  const [isExpanded, setExpanded] = useState(false);
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(readToken());
  }, [router.pathname]);

  async function submitForm(e) {
    e.preventDefault();
    const queryString = `title=true&q=${search}`;
    setSearchHistory(await addToHistory(`title=true&q=${search}`));
    router.push(`/artwork?title=true&q=${search}`);
    setExpanded(false);
  }

  function logout() {
    setExpanded(false);
    removeToken();
    console.log("User logged out");
    router.push("/login");
  }

  return (
    <>
      <Navbar
        expand="lg"
        expanded={isExpanded}
        className="fixed-top navbar-dark bg-primary"
      >
        <Container fluid>
          <Navbar.Brand>Rendell Velasco</Navbar.Brand>
          <Navbar.Toggle
            onClick={() => {
              setExpanded(!isExpanded);
            }}
            aria-controls="navbarScroll"
          />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Link href="/" passHref legacyBehavior>
                <Nav.Link
                  active={router.pathname === "/"}
                  onClick={() => setExpanded(false)}
                >
                  Home
                </Nav.Link>
              </Link>
              {token ? (
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/search"}
                    onClick={() => setExpanded(false)}
                  >
                    Advance Search
                  </Nav.Link>
                </Link>
              ) : null}
            </Nav>
            {token ? (
              <Form onSubmit={submitForm} className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="submit" variant="outline-success">
                  Search
                </Button>
              </Form>
            ) : null}
            &nbsp;
            {token ? (
              <Nav>
                <NavDropdown title={token.userName} id="basic-nav-dropdown" align="end">
                  <Link href="/favourites" passHref legacyBehavior>
                    <NavDropdown.Item
                      active={router.pathname === "/favourites"}
                      onClick={() => setExpanded(false)}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior>
                    <NavDropdown.Item
                      active={router.pathname === "/history"}
                      onClick={() => setExpanded(false)}
                    >
                      Search History
                    </NavDropdown.Item>
                  </Link>

                  <NavDropdown.Item onClick={() => logout()}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Nav>
                <Link href="/search" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/search"}
                    onClick={() => setExpanded(false)}
                  >
                    Login
                  </Nav.Link>
                </Link>
                <Link href="/register" passHref legacyBehavior>
                  <Nav.Link
                    active={router.pathname === "/register"}
                    onClick={() => setExpanded(false)}
                  >
                    Register
                  </Nav.Link>
                </Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
    </>
  );
}
