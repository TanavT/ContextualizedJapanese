function RequestStatus({loading, error}) {
    if (loading) return <p>Loading...</p>
    if (!error) return null

    return (
        <div>
            <p style={{color: 'red'}}>{`${error}. Current translation process halted.`}</p>
        </div>
    )
}

export default RequestStatus
