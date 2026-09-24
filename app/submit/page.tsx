import type { Metadata } from "next";
import { ArrowDownRight, Feather } from "lucide-react";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = { title: "Submit your work" };

export default function SubmitPage() {
  return <main className="submit-page">
    <section className="submit-intro">
      <span className="eyebrow"><Feather size={13}/> OPEN SUBMISSIONS · ALWAYS</span>
      <h1>Your voice<br/>belongs <em>here.</em></h1>
      <p>Every school has a hundred stories happening at once. This is a place to share yours—in words, images, ideas and everything between.</p>
      <div className="submit-promise"><span>01</span><div><b>Published right away.</b><small>Your work appears in the journal as soon as it is submitted. There is no approval queue.</small></div></div>
      <div className="submit-aside"><span>POEMS · PHOTOGRAPHS · ESSAYS<br/>STORIES · ART · BIG QUESTIONS</span><ArrowDownRight size={19}/></div>
      <div className="submit-margin-note">A PUBLICATION BY OUR STUDENTS<br/>FOR EVERYONE</div>
    </section>
    <SubmitForm/>
  </main>;
}
