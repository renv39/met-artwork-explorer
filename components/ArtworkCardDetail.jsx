import Link from "next/link";
import useSWR from "swr";
import Error from "next/error";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { useState, useEffect } from "react";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function ArtworkCardDetails({ objectID }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);

  console.log("favourites: ", favouritesList);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList]);

  const favouritesClicked = async () => {
    // when the button is clicked, add it to the favourites list if it is not already there, otherwise remove it from the favourites list
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(objectID));
      setShowAdded(false);
    } else {
      setFavouritesList(await addToFavourites(objectID));
      setShowAdded(true);
    }
  };

  const { data, isLoading, error } = useSWR(
    objectID
      ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
      : null,
  );
  if (error) {
    return <Error statusCode={404} />;
  }

  if (isLoading) {
    return null;
  }

  return (
    <>
      {data?.primaryImage && (
        <Card>
          <Card.Img
            variant="top"
            onError={(event) => {
              event.target.onerror = null;
              event.target.src =
                "https://placehold.co/375x375?text=Not+Available";
            }}
            src={
              data?.primaryImage ||
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
              <br />
              <br />
              Artist:{" "}
              {(data?.artistDisplayName && (
                <a
                  href={data?.artistWikidata_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data?.artistDisplayName}
                </a>
              )) ||
                "N/A"}
              <br />
              Credit Line: {data?.creditLine || "N/A"}
              <br />
              Dimensions: {data?.dimensions || "N/A"}
              <br />
              <Button
                onClick={favouritesClicked}
                variant={showAdded ? "primary" : "outline-primary"}
              >
                {showAdded ? "+ Favourite (added)" : "+ Favourite"}
              </Button>
            </Card.Text>
            <Link href={`/artwork/${objectID}`} passHref>
              <Button variant="primary">{objectID}</Button>
            </Link>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
