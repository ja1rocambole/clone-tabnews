import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      minTimeout: 1000,
    });

    async function fetchStatusPage() {
      const res = await fetch("http://localhost:3000/api/v1/status");
      const resBody = await res.json();

      if (res.status !== 200) {
        throw Error();
      }
    }
  }
}

export default {
  waitForAllServices,
};
