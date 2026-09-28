import ProfileForm from "./profile-form";

export default function Page() {
  return (
    <main className="profile-page">
      <section className="profile-panel" aria-labelledby="profile-title">
        <p className="profile-eyebrow">RAYDEN UI / NEXT.JS</p>
        <h1 id="profile-title">Make yourself at home.</h1>
        <p className="profile-intro">A small profile form. A starting point for your next app.</p>
        <ProfileForm />
      </section>
    </main>
  );
}
