import React from 'react'
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Divider from "@material-ui/core/Divider";

const 
FolderDetails = () => {
    const { t,  } = useTranslation();

    const data = useSelector(({ folderApp }) => {
        return folderApp.form.data || {};
    });

    const {
        MarqueVE,
        ModeleVE,
        AnneeVE,
        NIVVE,
        LieuEntreposageVE,
        PersonneContactVE,
        
        NoStockVE,
        AdresseVE,
        VilleVE,
        CodePostalVE,
        NotesVE,
        FraisDestruction,
        FraisDestructionChargePar,
        DimensionTotaleSpecimenH,
        DimensionTotaleSpecimenL,
        DimensionTotaleSpecimenP,
        FraisChargePar,
        CauseSinistre,
        EquipementEnCause,
        Manufacturier,
        Modele,
        ResultatProces,
        NoteProces,
        NumeroJugement,
        DateProchaineActivite,
       
    } = data

    return !data ? "Loading..." : (
        <div className="flex flex-wrap m-20">
            <div className="flex flex-wrap w-full sm:w-1/2 md:w-1/3 pr-0 sm:pr-32 self-start">
                <div className="w-full mb-16">
                    <h6 className="font-bold text-lg mb-6 leading-tight md:leading-normal">
                        {t("dApp:vehicle.information")} :
                </h6>
                </div>
                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.brand")}:</span>{" "}
                    <span>{MarqueVE}</span>{" "}
                </div>
                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.model")}:</span>{" "}
                    <span>{ModeleVE}</span>{" "}
                </div>
                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.year")}:</span>{" "}
                    <span>{AnneeVE}</span>{" "}
                </div>
                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.level")}:</span>{" "}
                    <span>{NIVVE}</span>{" "}
                </div>
                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.stock_number")}:</span>{" "}
                    <span>{NoStockVE}</span>{" "}
                </div>
                <div className="w-full mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.address")}: </span>
                    <address className="not-italic">
                        {AdresseVE}
                        {VilleVE && `, ${VilleVE}`}
                        {CodePostalVE && `, ${CodePostalVE}`}
                        {(AdresseVE || VilleVE || CodePostalVE) && `, Canada`}
                        {(!AdresseVE && !VilleVE && !CodePostalVE) &&
                            t("no_.address")}
                    </address>
                </div>
                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.storage_location")}:</span>{" "}
                    <span>{LieuEntreposageVE}</span>{" "}
                </div>
                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.contact_person")}:</span>{" "}
                    <span>{PersonneContactVE}</span>{" "}
                </div>
                {NotesVE && <div className="w-full md:w-full mb-8">
                    <span className="text-gray-500">{t("dApp:vehicle.note")}:</span>{" "}
                    <span>{NotesVE}</span>{" "}
                </div>}
            </div>
            <div className="flex flex-wrap w-full sm:w-1/2 md:w-1/3 pr-0 sm:pr-32 self-start">
                <div className="w-full mb-16">
                    <h6 className="font-bold text-lg mb-6 leading-tight md:leading-normal">
                        {t("dApp:destruction.information")}:
                </h6>
                </div>
                <div className="w-full md:w-full mb-8">
                    <span className="text-gray-500">{t("dApp:destruction.FraisDestruction")}:</span>{" "}
                    <span>{FraisDestruction}</span>{" "}
                </div>
                <div className="w-full md:w-full mb-8">
                    <span className="text-gray-500">{t("dApp:destruction.FraisDestructionChargePar")}:</span>{" "}
                    <span>{FraisDestructionChargePar}</span>{" "}
                </div>
                <div className="w-full m-8">
                    <Divider />
                </div>
                <div className="w-full mb-16"></div>
                <div className="w-full mb-16">
                    <h6 className="font-bold text-lg mb-6 leading-tight md:leading-normal">
                        {t("dApp:dimension.information")} :
                </h6>
                </div>
                <div className="w-full md:w-full mb-8">
                    <span className="text-gray-500">{t("dApp:dimension.DimensionTotaleSpecimenL")}:</span>{" "}
                    <span>{DimensionTotaleSpecimenL}</span>{" "}
                </div>
                <div className="w-full md:w-full mb-8">
                    <span className="text-gray-500">{t("dApp:dimension.DimensionTotaleSpecimenH")}:</span>{" "}
                    <span>{DimensionTotaleSpecimenH}</span>{" "}
                </div>
                <div className="w-full md:w-full mb-8">
                    <span className="text-gray-500">{t("dApp:dimension.DimensionTotaleSpecimenP")}:</span>{" "}
                    <span>{DimensionTotaleSpecimenP}</span>{" "}
                </div>
            </div>
            <div className="flex flex-wrap w-full sm:w-1/2 md:w-1/3 pr-0 sm:pr-32 self-start">
                <div className="w-full mb-16">
                    <h6 className="font-bold text-lg mb-6 leading-tight md:leading-normal">
                        {t("dApp:other.information")} :
                </h6>
                </div>
                {
                    FraisChargePar && <div className="w-full  mb-8">
                        <span className="text-gray-500">{t("dApp:other.fees_charge_by")}:</span>{" "}
                        <span>{FraisChargePar}</span>{" "}
                    </div>
                }
                {
                    EquipementEnCause && <div className="w-full  mb-8">
                        <span className="text-gray-500">{t("dApp:other.equipment_cause")}:</span>{" "}
                        <span>{EquipementEnCause}</span>{" "}
                    </div>
                }

                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:other.manufacturer")}:</span>{" "}
                    <span>{Manufacturier}</span>{" "}
                </div>
                <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:other.model")}:</span>{" "}
                    <span>{Modele}</span>{" "}
                </div>

                {ResultatProces && <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:other.resultat_proces")}:</span>{" "}
                    <span>{ResultatProces}</span>{" "}
                </div>}
                {NoteProces && <div className="w-full md:w-1/2 mb-8">
                    <span className="text-gray-500">{t("dApp:other.trial_note")}:</span>{" "}
                    <span>{NoteProces}</span>{" "}
                </div>}

                {
                    NumeroJugement && <div className="w-full md:w-1/2 mb-8">
                        <span className="text-gray-500">{t("dApp:other.judgment_number")}:</span>{" "}
                        <span>{NumeroJugement}</span>{" "}
                    </div>
                }

                {
                    DateProchaineActivite && <div className="w-full md:w-1/2 mb-8">
                        <span className="text-gray-500">{t("dApp:other.date_next_activity")}:</span>{" "}
                        <span>{DateProchaineActivite}</span>{" "}
                    </div>
                }

                {
                    CauseSinistre && <div className="w-full md:w-full mb-8">
                        <span className="text-gray-500">{t("dApp:other.sinister_cause")}:</span>{" "}
                        <span>{CauseSinistre}</span>{" "}
                    </div>
                }

            </div>
        </div>

    )
}
export default FolderDetails