import validObjectIDLists from "@/public/data/validObjectIDLists.json";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Error from "next/error";
import { Card } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Pagination } from "react-bootstrap";

import ArtworkCard from "@/components/ArtworkCard";

const PER_PAGE = 12;

export default function Artwork() {
  const [artworkList, setArtworkList] = useState();
  const [page, setPage] = useState(1);

  const router = useRouter();
  let finalQuery = router.asPath.split("?")[1];

  const { data, error, isLoading } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`,
  );

  const previousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = () => {
    if (page < artworkList.length) setPage(page + 1);
  };

  useEffect(() => {
    if (data) {
      let results = [];
      let filteredResults = validObjectIDLists.objectIDs.filter((x) =>
        data.objectIDs?.includes(x),
      );
      console.log(data);
      console.log(filteredResults);
      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (error) {
    return <Error statusCode={404} />;
  }

  if (isLoading) {
    return null;
  }

  return (
    <>
      {artworkList && artworkList.length > 0 ? (
        <>
          <Row className="gy-4">
            {artworkList[page - 1].map((listing) => (
              <Col xs={12} sm={6} md={4} lg={3} key={listing}>
                <ArtworkCard objectID={listing} />
              </Col>
            ))}
          </Row>

          <Pagination>
            <Pagination.Prev onClick={previousPage} />
            <Pagination.Item>{page}</Pagination.Item>
            <Pagination.Next onClick={nextPage} />
          </Pagination>
        </>
      ) : (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4> Try searching for something else
          </Card.Body>
        </Card>
      )}
    </>
  );
}
