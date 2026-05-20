import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { Card, ListGroup, Button } from "react-bootstrap";
import { useRouter } from "next/router";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from "@/lib/userData";

export default function History() {
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  let parsedHistory = [];

  // we want to avoid showing the nothing here page when the user first opens the page and the search history is still being fetched
  if (!searchHistory) return null;

  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  console.log(parsedHistory);

  const historyClicked = (e, index) => {
    router.push(`/artwork?${searchHistory[index]}`);
  };

  const removeHistoryClicked = async (e, index) => {
    e.stopPropagation(); // stop the event from trigging other events
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  };

  return (
    <>
      {!parsedHistory || parsedHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>
              <strong>Nothing Here</strong>
            </h4>
            Try searching for artwork!
          </Card.Body>
        </Card>
      ) : (
        <ListGroup className={styles.historyListItem}>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              onClick={(e) =>
                historyClicked(e, parsedHistory.indexOf(historyItem))
              }
            >
              {Object.keys(historyItem).map((key) => (
                <span key={key}>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </span>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}
