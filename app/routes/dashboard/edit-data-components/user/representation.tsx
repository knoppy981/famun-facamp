import TextField from "~/components/textfield"

const Representation = (props: any) => {
  const { defaultValues, handleChange, isDisabled, actionData, theme } = props

  return (
    <div className={`data-box-container ${theme ?? ""}`} style={{ placeSelf: "auto", alignSelf: "normal" }}>
      <h3 className="data-box-container-title blue-border">
        Representação
      </h3>

      {defaultValues.delegate?.committee ?
        <>
          <p className="text" style={{ whiteSpace: "normal", maxWidth: "300px" }}>{defaultValues.delegate?.committee?.council.replace(/_/g, " ")}</p>

          <p className="text">{defaultValues.delegate?.country}</p>
        </>
        :
        <p className="text italic">
          Não definido
        </p>
      }
    </div >
  )
}

export default Representation