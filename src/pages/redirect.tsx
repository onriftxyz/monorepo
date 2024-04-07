import type { GetServerSideProps } from "next";

const Redirect = () => {
  return <></>;
};

export default Redirect;

export const getServerSideProps = (async (ctx) => {
  return {
    redirect: {
      destination: ctx.query.path as string,
      permanent: true,
    },
  };
}) satisfies GetServerSideProps;
