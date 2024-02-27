import { useFetcher } from "@remix-run/react";
import React from "react";
import ComboBox, { Item } from "~/components/combobox";
import { Select } from "~/components/select";
import TextField from "~/components/textfield"
import { isoCountries } from "~/lib/ISO-3661-1";

const Representation = (props: any) => {
  const { defaultValues, handleChange, isDisabled, actionData, theme } = props
  const [comitteeList] = useComitteeList(defaultValues.participationMethod, defaultValues?.delegate?.comittee)
  function createCountryArray(countries: object) {
    return Object.keys(countries).map(countryName => {
      return {
        id: countryName
      };
    });
  }
  const countryArray = createCountryArray(isoCountries)

  return (
    <div className={`data-box-container ${theme ?? ""}`} style={{ placeSelf: "auto", alignSelf: "normal" }}>
      <h3 className="data-box-container-title blue-border">
        Representação
      </h3>

      <p className="text">{defaultValues.delegate?.comittee?.council.replace(/_/g, " ")}</p>

      <div className='data-box-input-container'>
        <Select
          className="secondary-input-box"
          label="Comitê"
          isDisabled={isDisabled}
          defaultSelectedKey={defaultValues?.delegate?.comittee?.id}
          placeholder="Não definido"
          onSelectionChange={value => handleChange({ target: { name: "delegate.comittee.id", value } })}
        >
          {comitteeList?.map((item) => <Item key={item.id}>{item.name}</Item>)}
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

function useComitteeList(participationMethod: string, defaultComittee: any): [any[]] {
  const [comitteeList, setComitteeList] = React.useState<any[]>(defaultComittee ? [defaultComittee] : [])
  const fetcher = useFetcher<any>()

  React.useEffect(() => {
    if (fetcher.data?.comittees) setComitteeList(fetcher.data.comittees)
  }, [fetcher.data])

  React.useEffect(() => {
    fetcher.load(`/admin/comittees?pm=${participationMethod}`)
  }, [])

  return [comitteeList]
}

export default Representation