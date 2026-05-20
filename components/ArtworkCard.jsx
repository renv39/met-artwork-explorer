import Link from "next/link";
import useSWR from "swr";
import Error from "next/error";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function ArtworkCard({ objectID }) {
  const { data, isLoading, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );
  if (error) {
    return <Error statusCode={404} />;
  }

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Card className="h-100">
        <Card.Img
          variant="top"
          onError={(event) => {
            event.target.onerror = null;
            event.target.src =
              "https://placehold.co/375x375?text=Not+Available";
          }}
          src={
            data?.primaryImageSmall ||
            "https://placehold.co/375x375?text=Not+Available"
          }
        />
        <Card.Body>
          <Card.Title>{data?.title || "N/A"}</Card.Title>
          <Card.Text>
            Date: {data?.objectDate || "N/A"}
            <br />
            Classification: {data?.classification || "N/A"}
            <br />
            Medium: {data?.medium || "N/A"}
          </Card.Text>
          <Link href={`/artwork/${objectID}`} passHref>
            <Button variant="primary">{objectID}</Button>
          </Link>
        </Card.Body>
      </Card>
    </>
  );
}
