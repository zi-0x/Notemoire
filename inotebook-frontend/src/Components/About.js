import React from 'react';

const About = () => {
  return (
    <div className="container my-4">
      <h2>About iNotebook</h2>
      <p className="mt-3">
        <strong>iNotebook</strong> is a personal notes management web application built as a part of learning the MERN (MongoDB, Express.js, React.js, Node.js) stack.
        It allows users to securely create, edit, delete, and manage their notes using a full-stack authentication system and a protected backend API.
      </p>
      <p>
        The project implements token-based authentication using JWT, a RESTful backend with Express and MongoDB, and a responsive frontend built with React and Bootstrap.
        Notes are private and only accessible to the logged-in user, providing a simple but secure way to manage personal information.
      </p>
      <p className="mt-4">
        This project was developed by <strong>Piyush Singh</strong> to strengthen his understanding of backend development in the MERN stack, including concepts like authentication, API design, secure routing, and state management in React.
      </p>
    </div>
  );
};

export default About;
