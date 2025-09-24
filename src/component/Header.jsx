// // component/Header.jsx
// import React from 'react';
// import { Navbar, Nav, Container, Button } from 'react-bootstrap';

// const Header = ({ isLoggedIn }) => {
//   return (
//     <Navbar bg="success" variant="dark" expand="lg" className="px-3" style={{ 
//       background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
//       boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
//       fontSize: "1.1rem"
//     }}>
//       <Container fluid>
//         <Navbar.Brand href="#home" className="d-flex align-items-center">
//           <i className="fas fa-leaf me-2" style={{ fontSize: "1.8rem" }}></i>
//           <strong style={{ fontSize: "1.6rem" }}>Herbal App</strong>
//         </Navbar.Brand>
        
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             {isLoggedIn && (
//               <>
//                 <Nav.Link href="#dashboard" className="mx-2 text-white fw-semibold">
//                   <i className="fas fa-tachometer-alt me-1"></i> Dashboard
//                 </Nav.Link>
//                 <Nav.Link href="#clients" className="mx-2 text-white fw-semibold">
//                   <i className="fas fa-users me-1"></i> Clients
//                 </Nav.Link>
//                 <Nav.Link href="#reports" className="mx-2 text-white fw-semibold">
//                   <i className="fas fa-chart-bar me-1"></i> Reports
//                 </Nav.Link>
//               </>
//             )}
//           </Nav>
          
//           <Nav>
//             {isLoggedIn ? (
//               <Button variant="outline-light" className="px-3">
//                 <i className="fas fa-sign-out-alt me-1"></i> Logout
//               </Button>
//             ) : (
//               <div className="d-flex">
//                 <Button variant="outline-light" className="me-2 px-3">
//                   <i className="fas fa-sign-in-alt me-1"></i> Login
//                 </Button>
//                 <Button variant="light" className="px-3">
//                   <i className="fas fa-user-plus me-1"></i> Sign Up
//                 </Button>
//               </div>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;