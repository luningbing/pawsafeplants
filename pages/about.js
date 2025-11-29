export default function About() {
  return (
    <div>
      <h1>About PawSafe Plants</h1>
      <p>
        This site provides general information about plant toxicity to cats.
        It is not a substitute for professional veterinary advice.
      </p>
      <p className="danger">
        ⚠️ If your cat has ingested any plant, contact your veterinarian or 
        the <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank">ASPCA Animal Poison Control Center</a> immediately.
      </p>
      <p>
        We compile data from trusted sources like ASPCA, but cannot guarantee completeness.
        Use at your own risk.
      </p>
      <p><a href="/">← Back to homepage</a></p>
    </div>
  );
}
