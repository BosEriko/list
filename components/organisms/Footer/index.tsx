const Footer = () => {
  return (
    <footer className="py-4 border-t border-gray-200 bg-white">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div>Bos Eriko List &copy; {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
};

export default Footer;
