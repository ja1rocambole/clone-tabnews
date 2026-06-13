import useSWR from "swr";

async function fetchStatus(key) {
  const res = await fetch(key);
  const resBody = await res.json();
  return resBody;
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchStatus, {
    refreshInterval: 2000,
  });

  let updatedText = "Carregando...";
  let databaseInfos = {};

  if (!isLoading && data) {
    updatedText = new Date(data.updated_at).toLocaleString("pt-BR");
    databaseInfos = data.dependencies.database;
  }

  return (
    <div>
      <p>Última atualização: {updatedText}</p>
      <p>Versão do Postgresql: {databaseInfos.version}</p>
      <p>Maximo de conexões suportadas: {databaseInfos.max_connections}</p>
      <p>Conexões abertas agora: {databaseInfos.opened_connections}</p>
    </div>
  );
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}
