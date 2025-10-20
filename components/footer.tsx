import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t bg-card/30">
      <div className="container mx-auto text-center flex flex-col sm:flex-row justify-center sm:justify-between text-muted-foreground">
        <p className="flex items-center justify-center">
          &copy; {new Date().getFullYear()} Fynli. Todos os direitos reservados.
        </p>
        <div className="flex items-center justify-center mt-4 sm:mt-0">
          <p className="bg-gradient-to-r from-primary/70 via-primary  to-primary/80 bg-clip-text text-transparent">
            Desenvolvido por
          </p>
          <Link href="https://thomgomes.vercel.app/" target="_blank">
            <Image src="/gifs/thomty.gif" alt="" width={40} height={40} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
