import Background from './Background';

const PageLayout = ({ children, className = '' }) => {
  return (
    <Background>
      <div className={`min-h-screen ${className}`}>{children}</div>
    </Background>
  );
};

export default PageLayout;
