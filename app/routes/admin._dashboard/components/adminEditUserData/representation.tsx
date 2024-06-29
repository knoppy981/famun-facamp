import { useFetcher } from "@remix-run/react";
import React from "react";
import ComboBox, { Item } from "~/components/combobox";
import { Select } from "~/components/select";
import TextField from "~/components/textfield"
import { isoCountries } from "~/lib/ISO-3661-1";

const Representation = (props: any) => {
  const { defaultValues, handleChange, isDisabled, actionData, theme } = props
  const [committeeList, countryArray] = useCommitteeList(defaultValues.participationMethod, defaultValues?.delegate?.committee)

  return (
    <div className={`data-box-container ${theme ?? ""}`} style={{ placeSelf: "auto", alignSelf: "normal" }}>
      <h3 className="data-box-container-title blue-border">
        Representação
      </h3>

      <p className="text">{defaultValues.delegate?.committee?.name}</p>

      <div className='data-box-input-container'>
        <Select
          className="secondary-input-box"
          label="Comitê"
          isDisabled={isDisabled}
          defaultSelectedKey={defaultValues?.delegate?.committee?.id}
          placeholder="Não definido"
          onSelectionChange={value => handleChange({ target: { name: "delegate.committee.id", value } })}
          maxWidth={270.09}
        >
          {committeeList?.map((item) => <Item key={item.id}>{item.name}</Item>)}
        </Select>

        <ComboBox
          className="secondary-input-box"
          name="country-representation"
          label="País"
          defaultItems={countryArray}
          onSelectionChange={value => { handleChange({ target: { name: "delegate.country", value } }) }}
          action={null}
          defaultSelectedKey={defaultValues?.delegate?.country}
          isDisabled={isDisabled}
          placeholder="Não definido"
        >
          {(item) => <Item textValue={item.id}>{item.id}</Item>}
        </ComboBox>
      </div>
    </div >
  )
}

function useCommitteeList(participationMethod: string, defaultCommittee: any): [any[], { id: string }[]] {
  const [committeeList, setCommitteeList] = React.useState<any[]>(defaultCommittee ? [defaultCommittee] : [])
  const [countryArray, setCountryArray] = React.useState<{ id: string }[]>([])
  const fetcher = useFetcher<any>()

  function createCountryArray(countries: object, representations: string[] | undefined) {
    const arr = Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });

    if (representations) {
      representations.forEach(item => {
        arr.push({ id: item })
      })
    }

    return arr
  }

  React.useEffect(() => {
    if (fetcher.data?.committees && fetcher.data?.representations) {
      setCommitteeList(fetcher.data.committees)
      setCountryArray(createCountryArray(isoCountries, fetcher.data?.representations))
    }
  }, [fetcher.data])

  React.useEffect(() => {
    fetcher.load(`/admin/committees?pm=${participationMethod}`)
  }, [])

  return [committeeList, countryArray]
}

export default Representation