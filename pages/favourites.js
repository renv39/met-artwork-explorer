import { useAtomValue } from "jotai";
import { favouritesAtom } from "@/store";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ArtworkCard from "@/components/ArtworkCard";

export default function Favourites() {
  const favouritesList = useAtomValue(favouritesAtom);
  if (!favouritesList) return null;
  return (
    <>
      {favouritesList && favouritesList.length > 0 ? (
        <>
          <Row className="gy-4">
            {favouritesList.map((listing) => (
              <Col xs={12} sm={6} md={4} lg={3} key={listing}>
                <ArtworkCard objectID={listing} />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Card>
          <Card.Body>
            <h4>
              <strong>Nothing Here</strong>
            </h4>
            Try adding some artworks to your favourites!
          </Card.Body>
        </Card>
      )}
    </>
  );
}
