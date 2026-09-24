"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";

const links = [
  { label: "The journal", href: "/articles" },
  { label: "Poetry", href: "/category/Poetry" },
  { label: "The gallery", href: "/category/Artwork" },
  { label: "On campus", href: "/category/School%20Activities" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="masthead-top">
        <span><i className="masthead-dot"/> VOL. 01 <span className="top-separator">/</span> SEPTEMBER 2026</span>
        <span className="masthead-note">A STUDENT PUBLICATION · OPEN TO EVERY VOICE</span>
        <Link href="/search" className="header-search"><span>Search the journal</span><Search size={15}/></Link>
      </div>
      <div className="nav-wrap">
        <Link className="brand" href="/" aria-label="The School Journal home">
          <span className="brand-mark">S<span>J</span></span>
          <span className="brand-lockup"><strong>THE SCHOOL<br/>JOURNAL</strong><small>Ideas, made visible.</small></span>
        </Link>
        <div className="masthead-wordmark"><span>THE</span><strong>SCHOOL JOURNAL</strong><small>THE STUDENT MAGAZINE · EST. 2026</small></div>
        <div className="nav-actions">
          <Link className="submit-link" href="/submit">Add your voice <ArrowUpRight size={15}/></Link>
          <button aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>
      <nav className={`main-nav${menuOpen ? " nav-open" : ""}`} aria-label="Main navigation">
        <span className="nav-index">EXPLORE</span>
        {links.map((item, index) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><small>0{index + 1}</small>{item.label}</Link>)}
        <Link className="all-categories-link" href="/articles" onClick={() => setMenuOpen(false)}>All stories <ArrowUpRight size={13}/></Link>
      </nav>
      <div className="header-rule"/>
    </header>
  );
}
