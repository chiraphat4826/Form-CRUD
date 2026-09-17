import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Student Course Hub",
  description: "เว็บไซต์รวบรวมข้อมูลรายวิชา",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <header className="siteHeader">
          <Navbar />
        </header>
        {children}
      </body>
    </html>
  );
}