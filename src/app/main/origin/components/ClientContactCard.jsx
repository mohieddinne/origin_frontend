import React from "react";
import { useQuery, gql } from "@apollo/client";
import Error from "@catu/components/TablesUI/Error";
import { useTranslation } from "react-i18next";

const query = gql`
  query clientContact($id: ID!) {
    clientContact(id: $id) {
      id
      jobTitle
      address
      city
      zip
      phone
      fax
      homeTel
      otherTel
      comments
    }
  }
`;

function ClientContactCard({ id }) {
  const { data, loading, error, refetch } = useQuery(query, {
    variables: { id },
  });

  if (error) return <Error retry={refetch} />;

  return (
    <div className="bg-gray-200 rounded-8 mb-16 p-8 flex flex-wrap">
      <ClientContactCardUI
        loading={loading}
        data={(data && data.clientContact) || null}
      />
    </div>
  );
}

/*
jobTitle: String

address: String
city: String
zip: String

phone: String
fax: String
homeTel: String
otherTel: String

comments: String*/

function ClientContactCardUI(props) {
  const { t } = useTranslation();
  const { data } = props;
  if (props.loading) {
    return t("loading");
  }

  const addrs = [];
  if (data.address) addrs.push(data.address);
  if (data.city) addrs.push(data.city);
  if (data.zip) addrs.push(data.zip);
  const addressString = addrs.join(", ");

  const phones = [];
  if (data.phone) phones.push({ icon: "phone", value: data.phone });
  if (data.fax) phones.push({ icon: "fax", value: data.fax });
  if (data.homeTel)
    phones.push({ icon: "homeTel", value: data.homeTel });
  if (data.otherTel)
    phones.push({ icon: "otherTel", value: data.otherTel });

  return (
    <div>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2">
          <div>
            <strong>{t("cApp:contacts.job_title")}:</strong>
            <div>
              <Value v={data.jobTitle} />
            </div>
          </div>
          <div>
            <strong>{t("cApp:contacts.address")}:</strong>
            <div>
              <Value v={addressString} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          {phones.map((item, i) => (
            <div key={i}>
              <strong>{t("cApp:contacts." + item.icon)}:</strong>
              <div>
                <a href={"tel:" + item.value}>{item.value}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <strong>{t("cApp:contacts.comments")}:</strong>
        <div>
          <Value v={data.comments} />
        </div>
      </div>
    </div>
  );
}

function Value({ v }) {
  const { t } = useTranslation();
  if (!v)
    return <span className="text-gray-500">{t("not_defined")}</span>;
  return v;
}

export default ClientContactCard;
