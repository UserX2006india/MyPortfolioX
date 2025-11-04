export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold mb-2">Govind Kharbade</p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={scrollToTop}
              className="text-sm hover:text-accent transition-colors"
            >
              Home
            </button>
            <a 
              href="#services"
              className="text-sm hover:text-accent transition-colors"
            >
              Services
            </a>
            <a 
              href="#work"
              className="text-sm hover:text-accent transition-colors"
            >
              Work
            </a>
            <a 
              href="#contact"
              className="text-sm hover:text-accent transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
