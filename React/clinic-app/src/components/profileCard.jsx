import {
  Container,
  Row,
  Col,
  Card,
  CardText,
  Image,
  CardBody,
} from "react-bootstrap";

export default function ProfileCard({ userData }) {
  return (
    <>
      <Col lg="6" className="mb-4 mb-lg-0 mx-auto">
        <Card className="mb-3 mt-5 rounded-4 shadow border-0">
          <Row className="g-0">
            <Col
              md="4"
              className="d-flex flex-column align-items-center justify-content-center rounded-start-4 gradient-custom text-center text-white"
            >
              <CardText className="h3 mb-3">
                {userData.first_name} {userData.last_name}
              </CardText>
              <CardText className="h5">{userData.username}</CardText>
            </Col>
            <Col md="8">
              <CardBody className="p-4">
                <span tag="h6" className="h4">
                  Information
                </span>
                <hr className="mt-0 mb-4" />
                <Row className="pt-1">
                  <Col size="6" className="mb-3">
                    <span tag="h6">First Name</span>
                    <CardText className="text-muted">
                      {userData.first_name}
                    </CardText>
                  </Col>
                  <Col size="6" className="mb-3">
                    <span tag="h6">Last Name</span>
                    <CardText className="text-muted">
                      {userData.last_name}
                    </CardText>
                  </Col>
                </Row>
                <Row>
                  {userData.groupe == "Doctor" ? (
                    <Col size="6" className="mb-3">
                      <span tag="h6">Speciality</span>
                      <CardText className="text-muted">
                        {userData.speciality}
                      </CardText>
                    </Col>
                  ) : null}
                </Row>

                <span tag="h6" className="h4">
                  Contact
                </span>
                <hr className="mt-0 mb-4" />
                <Row className="pt-1">
                  <Col size="6" className="mb-3">
                    <span tag="h6">Email</span>
                    <CardText className="text-muted">{userData.email}</CardText>
                  </Col>
                  <Col size="6" className="mb-3">
                    <span tag="h6">Phone</span>
                    <CardText className="text-muted">
                      {userData.phone ? userData.phone : "-"}
                    </CardText>
                  </Col>
                </Row>
              </CardBody>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
}
