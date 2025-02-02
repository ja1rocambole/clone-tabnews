import Image from "next/image";

function teste(params) {
  console.log("");
}

function Home() {
  return (
    <>
      <h1>Pedaço de internet que dedico a você</h1>
      <p>
        Eu quero apenas dizer que você é uma grande inspiração. Quando eu lhe
        observo e vejo a pessoa incrível que você é, sinto vontade de ser alguém
        melhor também. Só tenho a agradecer por ter você na minha vida. Te amo,
        meu cherinho!
      </p>
      <p>Com amor seu nego❤️</p>
      <h1>Com img:</h1>
      <img src="/dandadan.jpg" alt="Descrição da imagem" />

      <h1>Com img:</h1>
      <Image
        src="/dandadan.jpg"
        alt="Descrição da imagem"
        width={500}
        height={300}
      />
    </>
  );
}

export default Home;
