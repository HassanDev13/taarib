import { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import {
    ThumbsUp,
    ThumbsDown,
    ChevronRight,
    ChevronLeft,
    Image as ImageIcon,
    FileText,
    Star,
    CheckCircle,
    XCircle,
    Loader2,
    ExternalLink,
    Eye,
    Home,
    SkipForward,
} from "lucide-react";
import { useLanguage } from "@/Contexts/LanguageContext";
import ArabicTermsChart from "@/Components/charts/ArabicTermsChart";
import ArabicTermAgreementChart from "@/Components/charts/ArabicTermAgreementChart";

export default function CheckPage({
    term = null,
    page = null,
    resource = null,
    nextTermId = null,
    prevTermId = null,
    totalTerms = 0,
    currentPosition = 0,
    similarTerms = [],
    arabicTermFrequency = [],
}) {
    const { t } = useLanguage();
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showPdfDirectly, setShowPdfDirectly] = useState(false);

    const { post, processing } = useForm({
        is_positive: true,
    });

    // Reset feedback when term changes
    useEffect(() => {
        setFeedbackSubmitted(false);
        setSelectedFeedback(null);
        setImageLoaded(false);
        setShowPdf(false);
        setImageError(false);
        setShowPdfDirectly(false);

        // Check if image exists and show PDF directly if not
        if (page?.image_path) {
            const img = new Image();
            img.onload = () => {
                setImageError(false);
            };
            img.onerror = () => {
                setImageError(true);
                setShowPdfDirectly(true);
            };
            img.src = route("pages.image", page.id);
        } else {
            // No image_path at all — skip image load, go straight to PDF
            setImageError(true);
            setShowPdfDirectly(true);
            setShowPdf(true);
        }

        // Preload next image if available
        if (nextTermId && page?.image_path) {
            const preloadImage = new Image();
            preloadImage.src = route("pages.image", nextTermId);
        }
    }, [term?.id, nextTermId, page?.id, page?.image_path]);

    const handleFeedback = (isPositive) => {
        if (!term || feedbackSubmitted || processing) return;

        console.log("Submitting feedback:", { termId: term.id, isPositive });
        setSelectedFeedback(isPositive);
        setFeedbackSubmitted(true); // Show immediate feedback

        post(
            route("check.feedback", term.id),
            {
                is_positive: isPositive,
            },
            {
                preserveScroll: true,
                onSuccess: (response) => {
                    console.log("Feedback submitted successfully:", response);
                },
                onError: (errors) => {
                    console.error("Error submitting feedback:", errors);
                    setFeedbackSubmitted(false);
                    setSelectedFeedback(null);
                    alert("Failed to submit feedback. Please try again.");
                },
            },
        );
    };

    const handleNextTerm = () => {
        setFeedbackSubmitted(false);
        setSelectedFeedback(null);

        if (nextTermId) {
            router.get(route("check.term", nextTermId));
        } else {
            router.get(route("check.random"));
        }
    };

    const handlePrevTerm = () => {
        if (prevTermId) {
            router.get(route("check.term", prevTermId));
        }
    };

    const toggleView = () => {
        if (showPdfDirectly) {
            // If PDF is shown directly because image doesn't exist, we can't toggle back
            return;
        }
        setShowPdf(!showPdf);
    };

    const handleRandomTerm = () => {
        router.get(route("check.random"));
    };

    const handleGoHome = () => {
        router.get(route("terms.index"));
    };

    if (!term) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3 sm:p-4 md:p-8">
                <Head title={t("check.title")} />
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-8 sm:py-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-3 sm:mb-4">
                            <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {t("check.no_terms_title")}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                            {t("check.no_terms_description")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            <Button
                                onClick={handleRandomTerm}
                                size="lg"
                                className="w-full sm:w-auto"
                            >
                                <Eye className="h-5 w-5 mr-2" />
                                {t("check.start_checking")}
                            </Button>
                            <Button
                                onClick={handleGoHome}
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto"
                            >
                                <Home className="h-5 w-5 mr-2" />
                                {t("common.back")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Head title={t("check.title")} />
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 md:py-6">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                                    {t("check.title")}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {t("check.subtitle")}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGoHome}
                                    className="text-xs sm:text-sm"
                                >
                                    <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                    <span className="hidden sm:inline">
                                        {t("common.back")}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {/* Left column - Image/PDF viewer */}
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-2 sm:pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <CardTitle className="text-base sm:text-lg">
                                    {showPdf
                                        ? t("check.pdf_viewer")
                                        : t("check.image_viewer")}
                                </CardTitle>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {page?.image_path && resource && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={toggleView}
                                            className="flex items-center gap-1.5 text-xs sm:text-sm"
                                            disabled={showPdfDirectly}
                                        >
                                            {showPdf || showPdfDirectly ? (
                                                <>
                                                    <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="hidden xs:inline">
                                                        {t("check.view_image")}
                                                    </span>
                                                    <span className="xs:hidden">
                                                        Image
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    <span className="hidden xs:inline">
                                                        {t("check.view_pdf")}
                                                    </span>
                                                    <span className="xs:hidden">
                                                        PDF
                                                    </span>
                                                </>
                                            )}
                                        </Button>
                                    )}
                                    {resource && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                            className="text-xs sm:text-sm"
                                        >
                                            <a
                                                href={route(
                                                    "resources.pdf",
                                                    resource.id,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5"
                                            >
                                                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                                <span className="hidden sm:inline">
                                                    {t("check.open_full_pdf")}
                                                </span>
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <CardDescription className="text-xs sm:text-sm">
                                {resource?.name} - {t("common.page")}{" "}
                                {page?.page_number}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 h-full">
                            <div className="relative bg-gray-900 h-[calc(100vh-300px)] min-h-[400px] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
                                {/* Always show PDF if: 
                                    1. User toggled to PDF view, OR
                                    2. No image available, OR  
                                    3. Image failed to load */}
                                {(showPdf || showPdfDirectly || imageError) &&
                                resource &&
                                resource.path &&
                                page?.page_number ? (
                                    <iframe
                                        src={route("resources.pdf", { resource: resource.id }) + "#page=" + page.page_number}
                                        className="w-full h-full border-0"
                                        title="PDF Viewer"
                                    />
                                ) : page?.image_path || (resource && page?.page_number) ? (
                                    <>
                                        {!imageLoaded && !imageError && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                                <div className="text-center">
                                                    <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 animate-spin mx-auto mb-3" />
                                                    <p className="text-xs sm:text-sm text-gray-400">
                                                        Loading image...
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <img
                                            src={route(
                                                "pages.image",
                                                page.id,
                                            )}
                                            alt={`Page ${page?.page_number}`}
                                            className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                                            loading="eager"
                                                decoding="async"
                                                onLoad={() =>
                                                    setImageLoaded(true)
                                                }
                                                onError={() => {
                                                    setImageError(true);
                                                    setShowPdfDirectly(true);
                                                    setShowPdf(true);
                                                }}
                                            />
                                    </>
                                ) : (
                                    <div className="text-center p-4 sm:p-8">
                                        <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                                        <p className="text-xs sm:text-sm text-gray-400">
                                            {t("check.no_image_available")}
                                        </p>
                                        {resource && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setShowPdfDirectly(true);
                                                    setShowPdf(true);
                                                }}
                                                className="mt-2 text-xs"
                                            >
                                                View PDF
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/* Hidden preload image for next term */}
                                {nextTermId && (
                                    <img
                                        src={route("pages.image", nextTermId)}
                                        alt=""
                                        className="hidden"
                                        loading="eager"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right column - Term info and feedback */}
                    <div className="space-y-3 sm:space-y-4 md:space-y-6">
                        {/* Term information card */}
                        <Card>
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="text-base sm:text-lg">
                                    {t("check.term_to_check")}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    {t("check.review_instructions")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 sm:space-y-6">
                                {/* English term */}
                                <div>
                                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t("verify.english")}
                                    </h3>
                                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white break-words">
                                            {term.term_en ||
                                                t("check.no_english_term")}
                                        </p>
                                    </div>
                                </div>

                                {/* Arabic term */}
                                <div>
                                    <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t("verify.arabic")}
                                    </h3>
                                    <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <p
                                            className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white font-arabic text-right break-words"
                                            dir="rtl"
                                        >
                                            {term.term_ar ||
                                                t("check.no_arabic_term")}
                                        </p>
                                    </div>
                                </div>

                                {/* Confidence level */}
                                {term.confidence_level && (
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t("check.confidence")}
                                        </h3>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="flex items-center">
                                                {[...Array(10)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                                            i <
                                                            term.confidence_level
                                                                ? "text-yellow-500 fill-current"
                                                                : "text-gray-300 dark:text-gray-600"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                {term.confidence_level}/10
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Corrections (if any) */}
                                {term.corrections && (
                                    <div>
                                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t("check.corrections")}
                                        </h3>
                                        <div className="p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-words">
                                                {term.corrections}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Feedback card */}
                        <Card>
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="text-base sm:text-lg">
                                    {t("check.provide_feedback")}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    {t("check.feedback_instructions")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {feedbackSubmitted ? (
                                    <div className="space-y-4">
                                        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-pulse">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            <AlertTitle className="text-sm sm:text-base text-green-800 dark:text-green-300 font-bold">
                                                {t("check.feedback_thank_you")}{" "}
                                                ✅
                                            </AlertTitle>
                                            <AlertDescription className="text-xs sm:text-sm text-green-700 dark:text-green-400">
                                                {selectedFeedback
                                                    ? t(
                                                          "check.positive_feedback_received",
                                                      )
                                                    : t(
                                                          "check.negative_feedback_received",
                                                      )}
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <Button
                                                size="lg"
                                                className="h-auto py-3 sm:py-4 bg-green-500 hover:bg-green-600 text-white"
                                                onClick={() =>
                                                    handleFeedback(true)
                                                }
                                                disabled={processing}
                                            >
                                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full">
                                                    <ThumbsUp className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                                                    <div className="text-center sm:text-left">
                                                        <div className="font-semibold text-sm sm:text-base">
                                                            {t("check.like")}
                                                        </div>
                                                        <div className="text-xs opacity-90 mt-0.5">
                                                            {t(
                                                                "check.like_description",
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>

                                            <Button
                                                size="lg"
                                                className="h-auto py-3 sm:py-4 bg-red-500 hover:bg-red-600 text-white"
                                                onClick={() =>
                                                    handleFeedback(false)
                                                }
                                                disabled={processing}
                                            >
                                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full">
                                                    <ThumbsDown className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                                                    <div className="text-center sm:text-left">
                                                        <div className="font-semibold text-sm sm:text-base">
                                                            {t("check.dislike")}
                                                        </div>
                                                        <div className="text-xs opacity-90 mt-0.5">
                                                            {t(
                                                                "check.dislike_description",
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                                            {t("check.feedback_anonymous")}
                                        </p>
                                    </div>
                                )}

                                {/* Navigation buttons */}
                                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Button
                                        variant="outline"
                                        onClick={handlePrevTerm}
                                        disabled={!prevTermId || processing}
                                        className="flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        {t("check.previous_term")}
                                    </Button>

                                    <Button
                                        onClick={handleNextTerm}
                                        disabled={processing}
                                        className="flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                                    >
                                        {feedbackSubmitted ? (
                                            <>
                                                {t("check.next_term")}
                                                <ChevronRight className="h-4 w-4" />
                                            </>
                                        ) : (
                                            <>
                                                {t("check.skip_term")}
                                                <ChevronRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats card */}
                        <Card>
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="text-sm sm:text-base">
                                    {t("check.about_this_term")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 mb-1">
                                            {t("common.status")}
                                        </p>
                                        <Badge
                                            variant={
                                                term.status === "accepted"
                                                    ? "default"
                                                    : term.status === "rejected"
                                                      ? "destructive"
                                                      : "secondary"
                                            }
                                            className="text-xs"
                                        >
                                            {term.status === "accepted"
                                                ? t("verify.accepted")
                                                : term.status === "rejected"
                                                  ? t("verify.rejected")
                                                  : t("verify.unverified")}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400 mb-1">
                                            {t("check.extracted_on")}
                                        </p>
                                        <p className="text-gray-900 dark:text-white">
                                            {new Date(
                                                term.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Arabic Terms by Resource Chart */}
                <div className="mt-6 sm:mt-8">
                    <ArabicTermsChart
                        data={similarTerms}
                        currentTerm={term}
                        currentResource={resource}
                    />
                </div>

                {/* Arabic Term Agreement Radar Chart */}
                <div className="mt-6 sm:mt-8">
                    <ArabicTermAgreementChart
                        data={arabicTermFrequency}
                        currentTerm={term}
                    />
                </div>
                {/* Footer note */}
                <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
                    <p>
                        {t("check.footer_note")}{" "}
                        <Button
                            variant="link"
                            className="p-0 h-auto text-xs sm:text-sm"
                            onClick={() => router.get(route("login"))}
                        >
                            {t("check.login_to_edit")}
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
}
