const ErrorPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1 style={{ fontSize: "4em" }}>Error 404</h1>
      <div className="text-center">
        <p>Something went wrong :(</p>
        <p>You are not authorized to see this content</p>
      </div>
    </div>
  );
};

export default ErrorPage;
