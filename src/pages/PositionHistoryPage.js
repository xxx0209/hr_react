import React, { useState } from "react";
import PositionHistoryList from "../pages/PositionHistoryList";
import PositionHistoryForm from "../pages/PositionHistoryForm";

export default function PositionHistoryPage() {
    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefresh] = useState(false);

    return (
        <div className="container mt-4">
            <PositionHistoryList onAdd={() => setShowForm(true)} key={refresh} />
            <PositionHistoryForm
                show={showForm}
                onHide={() => setShowForm(false)}
                onSaved={() => setRefresh(!refresh)}
            />
        </div>
    );
}