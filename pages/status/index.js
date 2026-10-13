import DefaultLayout from "interface/DefaultLayout";
import useSWR from "swr";
import { Banner, Heading, Stack } from "@primer/react";
import { Card } from "@primer/react/experimental";

async function fetchStatus(key) {
  const res = await fetch(key);
  const resBody = await res.json();
  return resBody;
}

export default function StatusPage() {
  return (
    <DefaultLayout contentWidth="medium" metadata={{ title: "Status" }}>
      <Stack gap="spacious">
        <Heading as="h1">Status</Heading>
        <DatabaseStatus />
        <UpdatedAt />
      </Stack>
    </DefaultLayout>
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

  return (
    <Banner>
      <Banner.Title variant="info" layout="compact">
        Última atualização: {updatedText}
      </Banner.Title>
    </Banner>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchStatus, {
    refreshInterval: 2000,
  });

  if (isLoading || !data) {
    return;
  }

  const database = data.dependencies.database;
  const openedConnections = database.opened_connections;
  const maxConnections = database.max_connections;
  const version = database.version ?? "-";

  return (
    <Stack>
      <Heading as="h2" variant="medium">
        Database
      </Heading>
      <Stack direction={{ narrow: "vertical", regular: "horizontal" }}>
        <Stack.Item grow>
          <Card>
            <Card.Heading>Conexões abertas</Card.Heading>
            <Card.Description>{openedConnections}</Card.Description>
            <Card.Metadata>Uso nesse instante</Card.Metadata>
          </Card>
        </Stack.Item>

        <Stack.Item grow>
          <Card>
            <Card.Heading>Conexões máximas</Card.Heading>
            <Card.Description>{maxConnections}</Card.Description>
            <Card.Metadata>Conexões disponíveis</Card.Metadata>
          </Card>
        </Stack.Item>

        <Stack.Item grow>
          <Card>
            <Card.Heading>PostgreSQL</Card.Heading>
            <Card.Description>{version}</Card.Description>
            <Card.Metadata>Versão em execução</Card.Metadata>
          </Card>
        </Stack.Item>
      </Stack>
    </Stack>
  );
}
