import TextField from "~/components/textfield"

const SocialMediaData = (props: any) => {
  const { formData, handleChange, isDisabled, actionData, error } = props

  return (
    <div className={`data-box-container ${error ? "error" : ""}`}>
      <h3 className="data-box-container-title blue-border">
        Redes Sociais
      </h3>

      <div className='data-box-input-container'>
        {["instagram", "facebook", "linkedin"].map((socialMedia, index) => (
          <TextField
            className="secondary-input-box"
            key={index}
            name={`delegationAdvisor.${socialMedia}`}
            label={socialMedia.charAt(0).toUpperCase() + socialMedia.slice(1)}
            type="text"
            defaultValue={formData?.delegationAdvisor?.[socialMedia]}
            onChange={handleChange}
            isDisabled={isDisabled}
            placeholder="adicionar"
            errorMessage={actionData?.errors?.[socialMedia]}
            action={actionData}
          />
        ))}
      </div>

      <div className='data-box-border' />
    </div >
  )
}

export default SocialMediaData