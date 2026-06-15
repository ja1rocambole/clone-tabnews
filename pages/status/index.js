import useSWR from "swr";

async function fetchStatus(key) {
  const res = await fetch(key);
  const resBody = await res.json();
  return resBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchStatus, {
    refreshInterval: 2000,
  });

  let updatedText = "Carregando...";

  if (!isLoading && data) {
    updatedText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchStatus, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          j Conexões máximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }
  return (
    <>
      <h2>Database</h2>
      <div>{databaseStatusInformation}</div>
    </>
  );
}
